// ==UserScript==
// @name         BuildNow GG Custom Crosshair
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Crosshair only appears when enabled in the menu - Toggle menu with

// @author       R4W-F1SH3R
// @match        ://www.crazygames.com/game/buildnow-gg
// @match        ://.crazygames.com/
// @grant        none
// ==/UserScript==

(function() {
'use strict';

let isOpen = false;
const storageKey = 'r4w_crosshair_settings';

let config = JSON.parse(localStorage.getItem(storageKey)) || {
    enabled: false,
    type: 'plus',
    color: '#00ff00',
    image: null
};

const crosshair = document.createElement('div');
crosshair.id = 'r4w-crosshair-container';
Object.assign(crosshair.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    zIndex: '2147483647',
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center'
});
document.body.appendChild(crosshair);

const menu = document.createElement('div');
Object.assign(menu.style, {
    position: 'fixed',
    top: '50%',
    right: '50px',
    transform: 'translateY(-50%)',
    backgroundColor: '#121212',
    color: '#ffffff',
    padding: '20px',
    borderRadius: '12px',
    border: '2px solid #00ff00',
    zIndex: '2147483647',
    display: 'none',
    flexDirection: 'column',
    gap: '12px',
    fontFamily: 'sans-serif',
    width: '220px',
    boxShadow: '0 0 15px rgba(0, 255, 0, 0.3)'
});

menu.innerHTML = `
    <h2 style="margin:0; font-size: 18px; text-align:center; color:#00ff00;">R4W MENU</h2>

    <div style="display:flex; justify-content:space-between; align-items:center; background:#222; padding:10px; border-radius:5px;">
        <span style="font-size:12px; font-weight:bold;">Enable Crosshair</span>
        <input type="checkbox" id="xhair-toggle" ${config.enabled ? 'checked' : ''} style="cursor:pointer;">
    </div>

    <label style="font-size: 12px;">Type:</label>
    <select id="xhair-type" style="background:#222; color:#fff; border:1px solid #444; padding:5px;">
        <option value="plus">Plus</option>
        <option value="dot">Dot</option>
        <option value="gap">Gap</option>
        <option value="cross">Cross</option>
        <option value="circle">Circle</option>
        <option value="square">Square</option>
        <option value="t-shape">T-Shape</option>
        <option value="custom">Custom Image</option>
    </select>

    <label style="font-size: 12px;">Color:</label>
    <input type="color" id="xhair-color" value="${config.color}" style="width:100%; cursor:pointer;">

    <label style="font-size: 12px;">Custom Image:</label>
    <input type="file" id="xhair-upload" accept="image/*" style="font-size:11px;">

    <p style="font-size: 10px; text-align: center; opacity: 0.5; margin: 0;">Press \\ to close menu</p>
`;
document.body.appendChild(menu);

function updateCrosshairDisplay() {
    while (crosshair.firstChild) {
        crosshair.removeChild(crosshair.firstChild);
    }

    if (!config.enabled) {
        crosshair.style.display = 'none';
        return;
    }

    crosshair.style.display = 'flex';
    const color = config.color;

    if (config.type === 'custom' && config.image) {
        const img = new Image();
        img.src = config.image;
        img.style.maxWidth = '40px';
        img.style.maxHeight = '40px';
        crosshair.appendChild(img);
    } else {
        const xhairBody = document.createElement('div');
        xhairBody.style.position = 'relative';

        switch (config.type) {
            case 'plus':
                xhairBody.innerHTML = `<div style="width:20px; height:2px; background:${color}"></div>
                                       <div style="width:2px; height:20px; background:${color}; position:absolute; top:-9px; left:9px"></div>`;
                break;
            case 'dot':
                xhairBody.innerHTML = `<div style="width:6px; height:6px; background:${color}; border-radius:50%"></div>`;
                break;
            case 'gap':
                xhairBody.innerHTML = `<div style="width:2px; height:6px; background:${color}; margin-bottom:6px"></div>
                                       <div style="width:2px; height:6px; background:${color}; margin-top:6px"></div>
                                       <div style="width:6px; height:2px; background:${color}; position:absolute; left:-10px; top:8px"></div>
                                       <div style="width:6px; height:2px; background:${color}; position:absolute; right:-10px; top:8px"></div>`;
                break;
            case 'cross':
                xhairBody.style.transform = 'rotate(45deg)';
                xhairBody.innerHTML = `<div style="width:20px; height:2px; background:${color}"></div>
                                       <div style="width:2px; height:20px; background:${color}; position:absolute; top:-9px; left:9px"></div>`;
                break;
            case 'circle':
                xhairBody.innerHTML = `<div style="width:14px; height:14px; border:2px solid ${color}; border-radius:50%"></div>`;
                break;
            case 'square':
                xhairBody.innerHTML = `<div style="width:14px; height:14px; border:2px solid ${color}"></div>`;
                break;
            case 't-shape':
                xhairBody.innerHTML = `<div style="width:20px; height:2px; background:${color}"></div>
                                       <div style="width:2px; height:12px; background:${color}; position:absolute; left:9px"></div>`;
                break;
        }
        crosshair.appendChild(xhairBody);
    }
    localStorage.setItem(storageKey, JSON.stringify(config));
}

window.addEventListener('keydown', (e) => {
    if (e.key === '\\') {
        isOpen = !isOpen;
        menu.style.display = isOpen ? 'flex' : 'none';
    }
}, true);

document.getElementById('xhair-toggle').onchange = (e) => {
    config.enabled = e.target.checked;
    updateCrosshairDisplay();
};

document.getElementById('xhair-type').onchange = (e) => {
    config.type = e.target.value;
    updateCrosshairDisplay();
};

document.getElementById('xhair-color').oninput = (e) => {
    config.color = e.target.value;
    updateCrosshairDisplay();
};

document.getElementById('xhair-upload').onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            config.image = event.target.result;
            config.type = 'custom';
            document.getElementById('xhair-type').value = 'custom';
            updateCrosshairDisplay();
        };
        reader.readAsDataURL(file);
    }
};

document.getElementById('xhair-type').value = config.type;
updateCrosshairDisplay();
})();
