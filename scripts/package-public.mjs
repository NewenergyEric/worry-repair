// A portable, dependency-free ZIP writer for the explicit public file list.
import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const root=path.resolve(import.meta.dirname,'..');
execFileSync(process.execPath,['scripts/check-public.mjs'],{cwd:root,stdio:'inherit',windowsHide:true});
const manifest=JSON.parse(await readFile(path.join(root,'public-files.json'),'utf8'));
const pkg=JSON.parse(await readFile(path.join(root,'package.json'),'utf8'));
const destination=path.resolve(root,'..',`${pkg.name}-${pkg.version}.zip`);
const table=Array.from({length:256},(_,n)=>{let c=n;for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;return c>>>0});
function crc32(bytes){let crc=0xffffffff;for(const byte of bytes)crc=table[(crc^byte)&255]^(crc>>>8);return(crc^0xffffffff)>>>0}
let offset=0;const entries=[],directory=[];
for(const file of [...manifest.files].sort()){
  const name=Buffer.from(`${pkg.name}/${file}`),data=await readFile(path.join(root,file)),crc=crc32(data);
  const local=Buffer.alloc(30);local.writeUInt32LE(0x04034b50);local.writeUInt16LE(20,4);local.writeUInt16LE(0x800,6);local.writeUInt16LE(33,12);local.writeUInt32LE(crc,14);local.writeUInt32LE(data.length,18);local.writeUInt32LE(data.length,22);local.writeUInt16LE(name.length,26);
  const central=Buffer.alloc(46);central.writeUInt32LE(0x02014b50);central.writeUInt16LE(20,4);central.writeUInt16LE(20,6);central.writeUInt16LE(0x800,8);central.writeUInt16LE(33,14);central.writeUInt32LE(crc,16);central.writeUInt32LE(data.length,20);central.writeUInt32LE(data.length,24);central.writeUInt16LE(name.length,28);central.writeUInt32LE(offset,42);
  entries.push(local,name,data);directory.push(central,name);offset+=local.length+name.length+data.length;
}
const central=Buffer.concat(directory),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(manifest.files.length,8);end.writeUInt16LE(manifest.files.length,10);end.writeUInt32LE(central.length,12);end.writeUInt32LE(offset,16);
await writeFile(destination,Buffer.concat([...entries,central,end]));
console.log(`Created ${path.basename(destination)} from ${manifest.files.length} reviewed files.`);
