'use babel';

https = require('https');
import AtomPypiView from './atom-pypi-view';
import { CompositeDisposable } from 'atom';

export default {

    atomPypiView: null,
    modalPanel: null,
    subscriptions: null,

    activate(state) {
        this.atomPypiView = new AtomPypiView(state.atomPypiViewState);
        this.modalPanel = atom.workspace.addModalPanel({
            item: this.atomPypiView.getTempElement(),
            visible: false
        });

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'atom-pypi:latest': () => this.getLatest()
        }));
    },

    deactivate() {
        this.modalPanel.destroy();
        this.subscriptions.dispose();
        this.atomPypiView.destroy();
    },

    serialize() {
        return {
            atomPypiViewState: this.atomPypiView.serialize()
        };
    },

    showTempMessage(msg) {
        _this = this;
        _this.atomPypiView.setTempMsg(msg);
        _this.modalPanel.show();
        setTimeout(function () {
            _this.modalPanel.hide();
        }, 3000);
    },

    getLatest() {

        _this = this;

        editor = atom.workspace.getActiveTextEditor();
        selectedWord = editor.getSelectedText();

        if (!selectedWord) {
            _this.showTempMessage("Error: no text selected");
            return;
        }

        pypi_url = "https://pypi.python.org/pypi/" + selectedWord + "/json";

        https.get(pypi_url, function (res) {

            if (res.statusCode != 200) {
                _this.showTempMessage("Error: could not find package (" + selectedWord + ")");
                return;
            }

            pypiData = "";

            res.on("data", function (chunk) {
                pypiData += chunk;
            });

            res.on("end", function () {
                pypiData = JSON.parse(pypiData);
                replacementText = selectedWord + "==" + pypiData.info.version;
                editor.insertText(replacementText);
            });

        });
    }

};
