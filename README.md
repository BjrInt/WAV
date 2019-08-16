# WAV Helpers

A set of Node.js tools to load/save/slice/transpose .WAV audio file.
I do not maintain those helpers, they were made for my granular synthesizer engine and it has since been rewritten in Golang.


## " docs"

```javascript
const W = require ('W')

const wavFile = new W('path/to/file.wav')

// Checks if the file headers are properly set
wavFile.isValid()


// Gets a sample of n ms at offset ms
wavFile.getWindow(n, offset)
const slice = wavFile(5400, 25000) // gets 0:00:25.000-0:00:30.400


// Speeds up playback rate by x, and transpose
wavFile.transpose(x)
const doubleSpeedOctaveUp = wavFile.transpose(2)
const littleSlower = wavFile.transpose(0.75)

// Saves file (recreates valid WAV headers)
wavFile.save()
wavFile.transpose(1.2).save()
```
