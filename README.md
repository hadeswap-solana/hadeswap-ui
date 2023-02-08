#### fix WARNING in ./node_modules/@mercurial-finance/drift-sdk/dist/index.mjs
in str. 4 change 

`import pyth from "@pythnetwork/client";` 

to 

`import * as pyth from "@pythnetwork/client";`

---
