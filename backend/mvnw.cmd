@echo off
setlocal

set BASEDIR=%~dp0
set WRAPPER_JAR=%BASEDIR%\.mvn\wrapper\maven-wrapper.jar

if not defined JAVA_HOME goto UseJavaExe
set JAVA_EXEC=%JAVA_HOME%\bin\java.exe
goto RunWrapper

:UseJavaExe
set JAVA_EXEC=java.exe

:RunWrapper
%JAVA_EXEC% -classpath "%WRAPPER_JAR%" -Dmaven.multiModuleProjectDirectory="%BASEDIR%" org.apache.maven.wrapper.MavenWrapperMain %*
endlocal
