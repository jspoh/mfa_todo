# MFR_TODO

- MySQL database
- Flask api
- Angular framework

## Installation and usage

1. `git clone https://github.com/jspoh/mfa_todo.git` clone this repository
2. Open powershell and navigate to the project directory
3. Install dependencies for frontend
```powershell
cd frontend
npm i
```
4. Install dependencies for backend
```powershell
cd ../backend
pip install -r requirements.txt
```
5. Create `.env` file in backend directory and populate file
```env
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=
DB_DATABASE=
```
6. Start backend development server with `python main.py`
7. Follow step 2 and then enter
```powershell
cd frontend
npm start
```

<hr>

To read more on:
- `@login_required` decorator (flask_login module?)

To do:
- Find out sql injection vulnerabilities in this program
- Improve security by defending against brute force attacks
- Implement sql sanitization for arrays too (list, dict, set etc.)
- Implement pagination for todos (just for demostration lol)
