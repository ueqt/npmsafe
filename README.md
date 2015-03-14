# npmsafe
use npm safety

to solve [Nodejs应用仓库钓鱼](http://www.cnblogs.com/index-html/p/npm_package_phishing.html)

>npm repository may contain some harmful packages,  
>and these packages may protect them use some similar words as popular package,  
>such as `goodjs` to `good-js`, but `good-js` may contain harmful codes. 

use **npmsafe** instead of **npm**

## Badgers
[![NPM](https://nodei.co/npm/npmsafe.png?downloads=true&stars=true)](https://nodei.co/npm/npmsafe/)

[![Build Status](https://api.travis-ci.org/ueqt/npmsafe.png)](http://travis-ci.org/ueqt/npmsafe)

support **npmsafe check** to check package.json

## Installation

Through npm:
```bash
npm i npmsafe -g
```

Through GitHub:
```bash
git clone git@github.com:ueqt/npmsafe.git
cd npmsafe
npm link
```

Uninstall
```bash
npm remove npmsafe -g
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

**Example:**

```bash
$ npmsafe check
```
