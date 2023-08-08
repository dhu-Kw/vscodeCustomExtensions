const vscode = require('vscode');
const fs = require('fs');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate({ subscriptions }) {
  
  const comdId = 'lyric-book.statusBarLyric';
  const nextLineComdId = 'lyric-book.nextLineLyric';
  const data = { 'lyrics': [] , 'total': 0, 'current': 0};

  const myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
  myStatusBarItem.command = comdId;
  subscriptions.push(myStatusBarItem);

  subscriptions.push(
    vscode.commands.registerCommand(comdId, () => {
      const { lyricPath } = vscode.workspace.getConfiguration('lyric');
      const fr = fs.readFileSync(lyricPath, { encoding: 'utf-8' });
      const lines = fr.split(/\r?\n/);
      data['lyrics'] = lines;
      data['total'] = lines.length;
      console.log(data);
      myStatusBarItem.text = `${data['lyrics'][0]}        1 / ${data['total']}`;
      myStatusBarItem.show();
    })
  );

  subscriptions.push(
    vscode.commands.registerCommand(nextLineComdId, () => {
      data['current'] += 1;
      if (data['current'] === data['total']) data['current'] = 0;
      myStatusBarItem.text = `${data['lyrics'][data['current']]}        ${data['current'] + 1} / ${data['total']}`;
      myStatusBarItem.show();
    })
  );
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
