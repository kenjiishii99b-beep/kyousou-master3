from fastapi import APIRouter, Depends, HTTPException, Header, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
from .models_member import Member
from typing import Optional

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"]
)


# ==========================
# リクエストモデル
# ==========================

class RegisterRequest(BaseModel):
    company_name: Optional[str] = None
    last_name: str
    first_name: str
    email: str
    password: str
    phone: Optional[str] = None


class LoginRequest(BaseModel):
    email: str
    password: str


# ==========================
# 会員登録
# ==========================

@router.post("/register", status_code=status.HTTP_201_CREATED)
@router.post("/signup", status_code=status.HTTP_201_CREATED)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    clean_email = request.email.strip()
    clean_password = request.password.strip()

    existing_member = (
        db.query(Member)
        .filter(Member.email == clean_email)
        .first()
    )

    if existing_member:
        raise HTTPException(
            status_code=400,
            detail="このメールアドレスは既に登録されています。"
        )

    try:
        display_name = (
            f"{request.last_name} {request.first_name}"
        ).strip()

        new_member = Member(
            email=clean_email,
            password_hash=clean_password,
            display_name=display_name,
            organization_name=request.company_name or "",
            role="user",
            status="active"
        )

        db.add(new_member)
        db.commit()
        db.refresh(new_member)

        fake_token = f"custom-auth-token-{new_member.id}"

        return {
            "status": "success",
            "message": "会員登録が完了しました",
            "access_token": fake_token,
            "token_type": "bearer",
            "user_id": new_member.id
        }

    except Exception as e:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"データベース登録エラー: {str(e)}"
        )


# ==========================
# ログイン
# ==========================

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    input_email = request.email.strip().strip("'\"")
    input_password = request.password.strip().strip("'\"")

    member = (
        db.query(Member)
        .filter(Member.email == input_email)
        .first()
    )

    if not member:
        raise HTTPException(
            status_code=401,
            detail="メールアドレスまたはパスワードが間違っています。"
        )

    db_password = (
        getattr(member, "password_hash", None)
        or getattr(member, "password", None)
    )

    if db_password is not None:
        db_password = str(db_password).strip().strip("'\"")

    if db_password != input_password:
        raise HTTPException(
            status_code=401,
            detail="メールアドレスまたはパスワードが間違っています。"
        )

    fake_token = f"custom-auth-token-{member.id}"

    return {
        "access_token": fake_token,
        "token_type": "bearer",
        "user_id": member.id
    }


# ==========================
# ログインユーザー取得
# ==========================

@router.get("/me")
def get_me(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db),
):
    if authorization is None:
        raise HTTPException(
            status_code=401,
            detail="Authorizationヘッダーがありません。"
        )

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Bearerトークンがありません。"
        )

    token = authorization.replace("Bearer ", "")

    if not token.startswith("custom-auth-token-"):
        raise HTTPException(
            status_code=401,
            detail="トークンが不正です。"
        )

    try:
        user_id = int(
            token.replace("custom-auth-token-", "")
        )
    except ValueError:
        raise HTTPException(
            status_code=401,
            detail="トークンが不正です。"
        )

    member = (
        db.query(Member)
        .filter(Member.id == user_id)
        .first()
    )

    if member is None:
        raise HTTPException(
            status_code=404,
            detail="ユーザーが見つかりません。"
        )

    return {
        "id": member.id,
        "company_name": member.organization_name,
        "user_name": member.display_name,
        "email": member.email,
        "phone": getattr(member, "phone", "") or "",
        "role": member.role,
        "status": member.status,
    }