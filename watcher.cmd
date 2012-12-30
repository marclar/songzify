@ECHO OFF
:: Run various watcher scripts depending on the parameter

SET watch=default
IF NOT [%1]==[] (SET watch=%1)

ECHO.
ECHO.

ECHO First parameter is %watch% (9541196)

GOTO CASE_%watch%
  :CASE_jenkins

    ::Start Jenkins server
    CALL java -jar jenkins.war --httpPort=8411

    GOTO END_SWITCH

  :CASE_scss

    ::Sass
    CD public
    CALL sass --watch _scss:css

    GOTO END_SWITCH

  ::Invalid input

    ECHO First parameter must be coffee, scss, scss_jsdoc, less or jsdoc (No quotes!)

    GOTO END_SWITCH

  :END_SWITCH

ECHO.
ECHO.
