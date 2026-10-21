const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const context=vm.createContext({Date,Intl,window:{addEventListener(){}},document:{readyState:'loading'}});
vm.runInContext(fs.readFileSync(path.join(__dirname,'../solar-theme.js'),'utf8'),context);
const solar=vm.runInContext('({automaticSolarState,readableSolarPalette,mixPalette,solarPalettes})',context);
// Independent contrast calculation: invariants, not the implementation's helpers.
function luminance(color){let rgb=color.startsWith('#')?color.slice(1).match(/../g).map(v=>parseInt(v,16)):color.match(/[\d.]+/g).slice(0,3).map(Number);rgb=rgb.map(v=>{const s=v/255;return s<=.04045?s/12.92:((s+.055)/1.055)**2.4});return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722}
function contrast(a,b){const x=luminance(a),y=luminance(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
function verify(raw,label){const safe=solar.readableSolarPalette(raw);for(const token of ['text','muted','accent','accent2']){assert(contrast(safe.palette[token],raw.bg)>=4.5,`${label}: body ${token}`);for(const background of safe.glass.backgrounds)assert(contrast(safe.panel[token],background)>=4.5,`${label}: glass ${token}`)}for(const token of ['bg','surface','surface2','chip','nav'])assert.equal(safe.palette[token],raw[token],`${label}: background ${token} must retain its original interpolation`)}
test('every minute across all seasons keeps body and panel text readable',()=>{for(const month of [0,3,6,9])for(let minute=0;minute<1440;minute++){const state=solar.automaticSolarState(new Date(2026,month,21,0,minute));verify(state.palette,`${month+1}/${minute}`)}});
test('every intermediate colour is safe in both directions, including animated manual changes',()=>{const palettes=Object.values(solar.solarPalettes);for(const a of palettes)for(const b of palettes)for(let step=0;step<=100;step++)verify(solar.mixPalette(a,b,step/100),`${step}%`)});
test('the reported 18:35 dusk regression does not mix foreground into the background',()=>{const state=solar.automaticSolarState(new Date(2026,9,21,18,35));const safe=solar.readableSolarPalette(state.palette);verify(state.palette,'18:35');assert(contrast(safe.palette.text,state.palette.bg)>contrast(state.palette.text,state.palette.bg))});

test('glass remains translucent and reflective throughout the crossover',()=>{for(let step=0;step<=100;step++){const raw=solar.mixPalette(solar.solarPalettes.night,solar.solarPalettes.morning,step/100);const {glass}=solar.readableSolarPalette(raw);assert(glass.gloss>0);assert(glass.gloss<=1);assert(Number(glass.underlay.match(/,([.\d]+)\)$/)[1])<1)}});
