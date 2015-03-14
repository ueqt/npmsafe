# npmsafe
use npm safety

## Problem

[Nodejs应用仓库钓鱼](http://www.cnblogs.com/index-html/p/npm_package_phishing.html)

>npm repository may contain some harmful packages,  
>and these packages may protect them use some similar words as popular package,  
>such as `goodjs` to `good-js`, but `good-js` may contain harmful codes. 

## Solution

use **npmsafe** instead of **npm**

## Badgers
[![NPM](https://nodei.co/npm/npmsafe.png?downloads=true&stars=true)](https://nodei.co/npm/npmsafe/)

[![Build Status](https://api.travis-ci.org/ueqt/npmsafe.png)](http://travis-ci.org/ueqt/npmsafe)

[![Dependency Status](https://david-dm.org/ueqt/npmsafe.svg)](https://david-dm.org/ueqt/npmsafe)

[![Join the chat at https://gitter.im/ueqt/npmsafe](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ueqt/npmsafe?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Installation

### Through npm:
```bash
npm i npmsafe -g
```

### Through GitHub:
```bash
git clone git@github.com:ueqt/npmsafe.git
cd npmsafe
npm link
```

### Uninstall
```bash
npm remove npmsafe -g
```

### Publish
```bash
npm publish
```

# Usage

# `npmsafe xxx`
support all commands and arguments that npm support.

**Example:**

```bash
$ npmsafe install express
```

# `npmsafe check`
cd to folder which contains package.json, this command will check packages in package.json.  
if something not verified, you can check it's downloads count in last month to judge it safe or not.

**Example:**

```bash
$ npmsafe check

Analysing /Users/xujiase/git/node-biosl/package.json
 Not verified(package[downloads in npmjs in last month or stars in github(todo)]): 7
mysql [ 171232 ]
moment [ 1025532 ]
later [ 6008 ]
nodemailer [ 242134 ]
nodeutil [ 1111 ]
lodash [ 7512304 ]
influx [ 5146 ]
You can choose one choice:
[  1  ].Stop(Default)
[  2  ].Continue
[  3  ].Continue and save to whitelist
Please input your choice:
```

# custom whitelist
I will add much internal whitelist, but you still need more whitelist.  
So when you choose 3 in install time, it will save to your custom whiltelist.  
Custom whitelist is at `~/.npmsafe/customWhiteList.txt`  , you can also edit it manually.

