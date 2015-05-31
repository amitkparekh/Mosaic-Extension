@echo off
title Rename files
echo.

set dest="G:\Google Drive\amitparekh1196\Projects\Mosaic Extension\_locales"

set list=(ar am bg bn ca cs da de el en en_US es es_419 et fa fi fil fr gu he hi hr hu id it )


ren ".\ar\messages.json" "czech.json"
copy /Y ".\ar\messages.json" %dest%

ren ".\cs\messages.json" "czech.json"
copy /Y ".\cs\messages.json" %dest%

pause
