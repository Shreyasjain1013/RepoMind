export type SampleFile = {
  path: string
  language: string
  code: string
  entry?: boolean
  highlight?: [number, number]
  note: {
    text: string
    caveat: string
    ref: { label: string; start: number; end: number }
  }
}

export const SAMPLE_REPO = 'acme/backend-api'

export const SAMPLE_FILES: SampleFile[] = [
  {
    path: 'src/api/routes.py',
    language: 'python',
    entry: true,
    highlight: [6, 10],
    code: `from fastapi import APIRouter, Depends
from services.auth import authenticate_user

router = APIRouter(prefix='/auth')

@router.post('/login')
async def login(credentials: LoginRequest):
    user = await authenticate_user(
        credentials.email, credentials.password
    )
    return create_session(user)`,
    note: {
      text: 'The login route receives credentials and delegates verification to authenticate_user before a session is created.',
      caveat: 'create_session is called here but is not defined in the indexed files.',
      ref: { label: 'routes.py', start: 6, end: 10 },
    },
  },
  {
    path: 'src/services/auth.py',
    language: 'python',
    highlight: [4, 11],
    code: `from database.models import User
from core.security import verify_password

async def authenticate_user(email, password):
    user = await User.find_by_email(email)
    if not user:
        raise InvalidCredentials()

    if not verify_password(password, user.hash):
        raise InvalidCredentials()
    return user`,
    note: {
      text: 'Authentication resolves the user record, then verifies the stored password hash.',
      caveat: 'Session expiry is not visible in the indexed files.',
      ref: { label: 'auth.py', start: 4, end: 11 },
    },
  },
  {
    path: 'src/services/users.py',
    language: 'python',
    highlight: [3, 6],
    code: `from database.models import User

async def get_user(user_id):
    user = await User.get(user_id)
    if not user:
        raise UserNotFound(user_id)
    return user

async def create_user(email, password_hash):
    return await User.create(email=email, hash=password_hash)`,
    note: {
      text: 'The user service wraps model lookups and raises a domain error when a user cannot be found.',
      caveat: 'Password hashing happens before create_user is called; the caller is not shown here.',
      ref: { label: 'users.py', start: 3, end: 6 },
    },
  },
  {
    path: 'src/database/models.py',
    language: 'python',
    highlight: [4, 8],
    code: `from sqlalchemy import Column, String
from database.base import Base

class User(Base):
    __tablename__ = 'users'
    id = Column(String, primary_key=True)
    email = Column(String, unique=True, index=True)
    hash = Column(String, nullable=False)

    @classmethod
    async def find_by_email(cls, email):
        return await cls.query.filter_by(email=email).first()`,
    note: {
      text: 'The User model defines the stored credential hash and the email lookup used during login.',
      caveat: 'Migrations for this table are not part of the indexed files.',
      ref: { label: 'models.py', start: 4, end: 8 },
    },
  },
  {
    path: 'src/config.py',
    language: 'python',
    highlight: [3, 5],
    code: `import os

SECRET_KEY = os.environ['SECRET_KEY']
SESSION_TTL_SECONDS = int(os.getenv('SESSION_TTL', '3600'))
DATABASE_URL = os.environ['DATABASE_URL']`,
    note: {
      text: 'Configuration reads secrets and the session lifetime from environment variables.',
      caveat: 'This file defines a session TTL, but the session code that uses it is not indexed.',
      ref: { label: 'config.py', start: 3, end: 5 },
    },
  },
  {
    path: 'tests/test_auth.py',
    language: 'python',
    highlight: [4, 8],
    code: `import pytest
from services.auth import authenticate_user

@pytest.mark.asyncio
async def test_rejects_unknown_user():
    with pytest.raises(InvalidCredentials):
        await authenticate_user('nobody@example.com', 'secret')

@pytest.mark.asyncio
async def test_accepts_valid_credentials(user):
    assert await authenticate_user(user.email, 'secret') == user`,
    note: {
      text: 'Tests cover the unknown-user and valid-credential paths of authenticate_user.',
      caveat: 'There is no test for a wrong password on a known user.',
      ref: { label: 'test_auth.py', start: 4, end: 8 },
    },
  },
  {
    path: 'README.md',
    language: 'markdown',
    highlight: [1, 3],
    code: `# backend-api

A small FastAPI service with email and password login.

## Layout

- src/api: HTTP routes
- src/services: business logic
- src/database: models`,
    note: {
      text: 'The README describes the layout: routes, services and database models are separated by folder.',
      caveat: 'It does not document deployment or environment setup.',
      ref: { label: 'README.md', start: 1, end: 3 },
    },
  },
]

export const SAMPLE_BY_PATH = Object.fromEntries(
  SAMPLE_FILES.map((file) => [file.path, file]),
) as Record<string, SampleFile>

export type GraphNode = {
  id: string
  index: string
  label: string
  path: string
  x: number
  y: number
  description: string
}

export const GRAPH_NODES: GraphNode[] = [
  {
    id: 'routes',
    index: '01',
    label: 'API route',
    path: 'src/api/routes.py',
    x: 18,
    y: 16,
    description: 'Receives login requests and hands credentials to the auth service.',
  },
  {
    id: 'auth',
    index: '02',
    label: 'Authentication',
    path: 'src/services/auth.py',
    x: 46,
    y: 44,
    description: 'Validates credentials and resolves the user model before session creation.',
  },
  {
    id: 'users',
    index: '03',
    label: 'User service',
    path: 'src/services/users.py',
    x: 78,
    y: 14,
    description: 'Looks up and creates users on top of the database models.',
  },
  {
    id: 'models',
    index: '04',
    label: 'Database models',
    path: 'src/database/models.py',
    x: 40,
    y: 84,
    description: 'Defines the User table and the email lookup used at login.',
  },
  {
    id: 'tests',
    index: '05',
    label: 'Auth tests',
    path: 'tests/test_auth.py',
    x: 14,
    y: 74,
    description: 'Exercises the unknown-user and valid-credential paths.',
  },
  {
    id: 'config',
    index: '06',
    label: 'Configuration',
    path: 'src/config.py',
    x: 80,
    y: 60,
    description: 'Reads secrets and session settings from the environment.',
  },
]

export const GRAPH_EDGES: { from: string; to: string; active?: boolean }[] = [
  { from: 'routes', to: 'auth', active: true },
  { from: 'users', to: 'auth' },
  { from: 'config', to: 'auth' },
  { from: 'tests', to: 'auth' },
  { from: 'auth', to: 'models', active: true },
]
