# ITSS PROJECT

### Requirements
- Python, Yarn, Docker, Docker Compose

### FRONTEND
- Yarn, React, Tailwind
```sh
cd frontend
yarn install # For the first time
yarn dev
```

- Install dependencies, using this command:
```sh
yarn add <dependencies> -W
```

### BACKEND
- FastAPI, MongoDB
```sh
cd backend
python3 -m venv venv #Or python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

docker compose up -d
python app/main.py
```
- Fix ImportError: email-validator is not installed, run pip install pydantic[email]
```sh
pip install 'pydantic[email]'
```

- Open: http://127.0.0.1:8000/docs

### DATABASE
- MongoDB WebUI: http://127.0.0.1:8081/
- Credential: root - password
