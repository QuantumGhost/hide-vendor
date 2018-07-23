// ==UserScript==
// @name         Hide Vendor
// @namespace    http://github.com/QuantumGhost/
// @version      0.1
// @description  Hide golang vendor files on gitlab diff pages.
// @copyright 2018+, QuantumGhost (https://github.com/QuantumGhost)
// @match        https://gitlab.com/*
// @homepageURL  http://github.com/QuantumGhost/hide-vendor
// @supportURl   http://github.com/QuantumGhost/hide-vendor/issues
// @license      BSD-3-Clause
// ==/UserScript==

// ==OpenUserJS==
// @author QuantumGhost
// @collaborator QuantumGhost
// ==/OpenUserJS==

const GITLAB_DIFF_FILE_TITLE = "file-title-name";
const VENDOR_PATTERN = /^vendor/i

function removeVendorFileDiffs(diffNodes) {
    'use strict';
    let toRemove = [];
    for (let diff of diffNodes) {
        let titleNodes = diff.getElementsByClassName(GITLAB_DIFF_FILE_TITLE);
        if (titleNodes.length === 0) {
            continue
        }
        let titleNode = titleNodes[0]
        if (titleNode.dataset.originalTitle && VENDOR_PATTERN.exec(titleNode.dataset.originalTitle)) {
            toRemove.push(diff);
        }
    }
    setTimeout(function () {
        for (let node of toRemove) {
            console.log(node);
            node.remove();
        }
    }, 0);
}

function filterMutation(mutations) {
    var node = null;
    for (let m of mutations) {
        if (m.type !== "childList") {
            continue;
        }
        for (let n of m.addedNodes) {
            if (n.className === "files") {
                node = n
                break;
            }
        }
        if (node !== null) {
            break;
        }
    }

    if (node === null) {
        return;
    }
    if (node.parentElement.matches("#diffs")) {
        removeVendorFileDiffs(node.childNodes)
    }
}

function observeDiffChange(node) {
    let observer = new MutationObserver(filterMutation);
    observer.observe(node, {childList: true, subtree: true});
}

(function() {
    'use strict';
    let diffNotes = document.getElementById("diff-notes-app");
    if (diffNotes === null) {
        return;
    }
    observeDiffChange(diffNotes);
})();
