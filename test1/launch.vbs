' My PMS 런처 - 로컬 서버를 조용히 켜고 브라우저로 엽니다.
Set sh = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

' 이 스크립트가 있는 폴더
folder = fso.GetParentFolderName(WScript.ScriptFullName)
sh.CurrentDirectory = folder

' Node 서버를 창 없이 백그라운드로 실행 (이미 실행 중이면 그냥 무시됨)
node = "C:\Program Files\nodejs\node.exe"
sh.Run """" & node & """ """ & folder & "\server.js""", 0, False

' 서버가 뜰 시간을 잠깐 준 뒤 기본 브라우저로 열기
WScript.Sleep 900
sh.Run "http://localhost:8787/", 1, False
