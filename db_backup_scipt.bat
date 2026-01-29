@echo off
set hour=%TIME:~0,2%
if "%hour:~0,1%"==" " set hour=0%hour:~1,1%
set TIMESTAMP=%DATE:~10,4%-%DATE:~4,2%-%DATE:~7,2%_%hour%%TIME:~3,2%

set BACKUP_DIR=C:\Users\Admin\Documents\devprojectst\dumps
if not exist "%BACKUP_DIR%" (
    mkdir "%BACKUP_DIR%"
)

"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe" ^
    -u root -p"1jsQM#7bTmKv*vDBroot" ^
    --no-data --databases procurementtracker ^
    > "%BACKUP_DIR%\procurementtracker_%TIMESTAMP%.sql"
