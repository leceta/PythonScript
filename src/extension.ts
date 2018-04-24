'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "rhinopython" is now active!');
    
    
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.CodeSender', () => {
        // The code you place here will be executed every time your command is executed
        
        // check if editor is open
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No code detected.');
            return;
        } else {
            let text = editor.document.getText();

            if (!text) {
                vscode.window.showWarningMessage('No code detected.');
                return;
            }
    
            let temp = editor.document.isUntitled;
            let fileName = editor.document.fileName;
            console.log(temp);
            console.log(fileName);
            // check if it is temp file, if yes then save to a temp file
            
            var fs = require('fs');
            var os = require('os');
            var tmpfolder = os.tmpdir();
            var filename = tmpfolder + "\\TempScript.py";
            fs.writeFileSync(filename, text);
        }
        
        // send the code to rhino
        var net = require('net');
        var client = new net.Socket();

        client.connect(614, '127.0.0.1', function() {
            client.write(filename);
            vscode.debug.activeDebugConsole.append('\n');
            vscode.debug.activeDebugConsole.appendLine(`@ ====== ${(new Date()).toLocaleString()} ======`);
            vscode.debug.activeDebugConsole.append('\n');
        });


        client.on('data', function(data: Buffer) {
            // vscode.commands.executeCommand('workbench.debug.panel.action.clearReplAction')
            vscode.debug.activeDebugConsole.append(data.toString());
            vscode.debug.activeDebugConsole.append('\n');
            // client.destroy();
        });
        
        // Add a 'close' event handler for the client socket
        client.on('close', function() {
            // console.log('Rhino disconnected.');
        });
        
        client.on('error', function(err: object) {
            vscode.debug.activeDebugConsole.appendLine(err.toString());
            vscode.debug.activeDebugConsole.appendLine('Please make sure Rhino is running CodeListener.');
        });

    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {

}