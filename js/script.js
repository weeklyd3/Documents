/*
	The main script of Horsey Documents.
	Copyright (C) 2021 Horsey Company

	The source code for this program is licensed under the GNU GPL. See
	the file "gnu-gpl-3.0.txt" in the root directory. See also this:

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
"use strict";
var remote = require('remote'); // Load remote compnent that contains the dialog dependency
var dialog = require('dialog').remote.app; // Load the dialogs component of the OS
var fs = require('fs'); // Load the File System to execute our common tasks (CRUD)
// Iframes are not immediately accessible through the DOM.
var ifrm = document.getElementById("writehere");
var ifrm = ifrm.contentWindow || ifrm.contentDocument.document || ifrm.contentDocument;
function fix(fix) {
	var fixed = fix.replace(/</g, "&lt;");
	var fixed = fixed.replace(/>/g, "&gt;");
	var fixed = fixed.replace(/&/g, "&amp;")
	return fixed;
}
function openTab(event, tabName) {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	var tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	document.getElementById(tabName).style.display = "block";
	event.currentTarget.className += " active";
}
/* credit: https://stackoverflow.com/users/2007333 */
function saveTextAsFile(saveme, filetype) {
  var textToWrite = saveme.innerHTML;
  var textFileAsBlob = new Blob([ textToWrite ], { type: filetype });
  var fileNameToSaveAs = "";

  var downloadLink = document.createElement("a");
  downloadLink.download = fileNameToSaveAs;
  downloadLink.innerHTML = "Download File";
  if (window.webkitURL != null) {
    // Chrome allows the link to be clicked without actually adding it to the DOM.
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
  } else {
    // Firefox requires the link to be added to the DOM before it can be clicked.
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
  }

  downloadLink.click();
}
/* credit: https://stackoverflow.com/users/9639020/ */
function createBrowserWindow() {
  const remote = require('electron').remote;
  const BrowserWindow = remote.BrowserWindow;
  const win = new BrowserWindow({
    height: 600,
    width: 800
  });

  win.loadURL(location.href);
}
function opendoc() {
	dialog.showOpenDialog((fileNames) => {
		// fileNames is an array that contains all the selected
		if(fileNames === undefined){
			console.log("No file selected");
			return;
		}

		fs.readFile(filepath, 'utf-8', (err, data) => {
			if(err){
				alert("An error ocurred reading the file :" + err.message);
				return;
			}

			// Change how to handle the file content
			ifrm.document.getElementById('writehere').innerHTML = data;
			document.getElementById('title').innerHTML = "Horsey Documents - "+fix(filepath);
		});
	});
}