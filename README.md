# RECORDER
 
 record audio from microphone and encode the output to mp3 and returns a blob  
 
## Dependencies
  
  record is exported as global var
  
  add to bower.json:
  
   "dependencies": {
       "recorder": "https://github.com/Knowledge-OTP/recorder.git#~1.0.0",
   }

## API
   
   Constructor: 
   
```javascript
    /* options:
       
    fixedMedia(required): if not provided, uses the MediaRecorder api for newer browsers, 
                          and AudioContext api for older ones. 
                          (IMPORTENT!: only support AudioContext at the moment, so always use it)
    */                      
      
    // initialize recorder 
    var r = new RaccoonRecorder({
          fixedMedia: RaccoonRecorder.MEDIA_ENUM.audioContext
    });
```  
         
   Methods:

```javascript
    // start record
    
    r.start();
    
    // stop record
    
    r.stop();
```

  Static Methods:
  
```javascript
  
    // get the current version
     
    RaccoonRecorder.VERSION // ie: '1.0.0'
     
    // get available media wrappers 
     
    RaccoonRecorder.MEDIA_ENUM // ie: { mediaRecorder: 1, audioContext: 2 }
```

  LifeCycle Events:
  
```javascript
  
    //  on permisson access - user enable audio media
    
    r.onPermissonAccess = function() {
        console.log('on permissonAccess');  
    };
    
    //  on permisson denied - user denied audio media

    r.onPermissonDenied = function() {
        console.log('on permissonDenied');  
    };
    
    //  on start record 

    r.onStart = function() {
        console.log('on play');  
    };

    //  on stop record

    r.onStop = function() {
        console.log('on stop');  
    };
    
    //  on media ready - returns a blob

    r.onMediaReady = function(blob) {
        console.log('blob', blob);
    }  
```  
 
## DEVELOPMENT

   run tests
  
    npm test
    
   run local 
  
    npm start 
    
   run build 
  
    npm run build
    
### Things to do for future versions - (in various importance) 

* Metohds: add a pause method

* LifeCycle: if implaments the pasue method, add a on pause event

* LifeCycle: add an on progress event

* add export in ogg and wav also, now support only mp3

* enable inline worker instead of require throuh script

* add comments to code

* add tests 

* try to improve recording, now only encode left channel 

    



  

