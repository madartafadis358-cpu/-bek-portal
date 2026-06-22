@echo off
cd /d "D:\MOURAD-TRAV-OP-CODE\BEK"
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -R bek-portal:80:localhost:5173 serveo.net 2>&1
