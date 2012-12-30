@ECHO OFF
:: Start (or restart) nodejs server depending on parameter

SET option=default
IF NOT [%1]==[] (SET option=%1)

ECHO.
ECHO.

ECHO option parameter is "%option%" (4039061)

GOTO CASE_%option%
    :CASE_default
        
        ::Start normally
        CALL foreman start -f Procfile_dev

        GOTO END_SWITCH

    :CASE_test
        
        ::Run tests
        CALL cd C:\Users\MK\Desktop\www\songzify\
        CALL fab t
        PAUSE

        GOTO END_SWITCH

    :CASE_restart

    	::Use Fabric to restart all
    	CALL cd C:\Users\MK\Desktop\www\songzify\
    	CALL fab restart

        GOTO END_SWITCH
    :END_SWITCH

ECHO.
ECHO.
