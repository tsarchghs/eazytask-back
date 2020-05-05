# eazytask-back
[![Codefresh build status]( https://g.codefresh.io/api/badges/pipeline/gjergjk71/eazytask%2Feazytask-back?key=eyJhbGciOiJIUzI1NiJ9.NWViMDAyYzRiNWE4OTgwM2YyYTVmNWFj.5I4n4RTzR_9Y0TlYRZ9A3LVCU7SOXcUbGn7MowCFuPc&type=cf-2)]( https%3A%2F%2Fg.codefresh.io%2Fpipelines%2Feazytask-back%2Fbuilds%3Ffilter%3Dtrigger%3Abuild~Build%3Bpipeline%3A5eb004b6ef78d25108539b14~eazytask-back)[![codecov](https://codecov.io/gh/gjergjk71/eazytask-back/branch/master/graph/badge.svg?token=M3XIHZWBQ6)](https://codecov.io/gh/gjergjk71/eazytask-back)

<h1>Set-up:</h1>
<ul>
  <li><code>npm install</code></li>
  <li><code>npm start</code></li>
</ul>
<h5>Run tests: <code>npm run test</code></h5>


# src/lib docs

Rules:
- `{resource}-api` will contain everything needed by the API's implemented in said folder
  - Refer to the currently implemented API's to use the same patterns
- `{rosource-dal}` will contain every DAL function related to {resource} that is used in more than one lib
