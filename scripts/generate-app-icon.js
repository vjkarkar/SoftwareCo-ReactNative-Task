#!/usr/bin/env node
/**
 * Generate app icons from source image for Android and iOS
 * Run: node scripts/generate-app-icon.js
 */

const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../assets/app-icon-source.png');
if (!fs.existsSync(sourcePath)) {
    console.error('Source image not found:', sourcePath);
    process.exit(1);
}

async function main() {
    let sharp;
    try {
        sharp = require('sharp');
    } catch {
        console.log('Installing sharp...');
        require('child_process').execSync('npm install sharp --save-dev', {
            stdio: 'inherit',
            cwd: path.join(__dirname, '..'),
        });
        sharp = require('sharp');
    }

    const source = sharp(sourcePath);
    const androidSizes = [
        { dir: 'mipmap-mdpi', size: 48 },
        { dir: 'mipmap-hdpi', size: 72 },
        { dir: 'mipmap-xhdpi', size: 96 },
        { dir: 'mipmap-xxhdpi', size: 144 },
        { dir: 'mipmap-xxxhdpi', size: 192 },
    ];
    const baseRes = path.join(__dirname, '../android/app/src/main/res');

    for (const { dir, size } of androidSizes) {
        const outDir = path.join(baseRes, dir);
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
        const buf = await source.clone().resize(size, size).png().toBuffer();
        fs.writeFileSync(path.join(outDir, 'ic_launcher.png'), buf);
        fs.writeFileSync(path.join(outDir, 'ic_launcher_round.png'), buf);
        console.log('Android', dir, size + 'x' + size);
    }

    const iosSizes = [40, 58, 60, 80, 87, 120, 180, 1024];
    const iosDir = path.join(__dirname, '../ios/SoftwareCo/Images.xcassets/AppIcon.appiconset');
    const contents = {
        images: [
            { idiom: 'iphone', scale: '2x', size: '20x20', filename: 'Icon-40.png' },
            { idiom: 'iphone', scale: '3x', size: '20x20', filename: 'Icon-60.png' },
            { idiom: 'iphone', scale: '2x', size: '29x29', filename: 'Icon-58.png' },
            { idiom: 'iphone', scale: '3x', size: '29x29', filename: 'Icon-87.png' },
            { idiom: 'iphone', scale: '2x', size: '40x40', filename: 'Icon-80.png' },
            { idiom: 'iphone', scale: '3x', size: '40x40', filename: 'Icon-120.png' },
            { idiom: 'iphone', scale: '2x', size: '60x60', filename: 'Icon-120.png' },
            { idiom: 'iphone', scale: '3x', size: '60x60', filename: 'Icon-180.png' },
            { idiom: 'ios-marketing', scale: '1x', size: '1024x1024', filename: 'Icon-1024.png' },
        ],
        info: { author: 'xcode', version: 1 },
    };

    for (const size of iosSizes) {
        const buf = await source.clone().resize(size, size).png().toBuffer();
        fs.writeFileSync(path.join(iosDir, `Icon-${size}.png`), buf);
        console.log('iOS', size + 'x' + size);
    }
    fs.writeFileSync(path.join(iosDir, 'Contents.json'), JSON.stringify(contents, null, 4));
    console.log('App icons generated.');
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
