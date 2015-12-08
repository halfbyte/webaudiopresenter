"use strict";

class WebAudioPresenter {
  constructor() {
    this.initAudio();
    this.initScopes();
    this.initSlides();
    this.initKeyboardListeners();
  }
  initAudio() {
    this.ac = new AudioContext();
    // to keep the Scope going even if no audio is generated.
    var nullOsc = this.ac.createOscillator();
    var nullAmp = this.ac.createGain();
    nullAmp.gain.value = 0;
    nullOsc.connect(nullAmp);
    this.analyser = this.ac.createAnalyser()
    this.analyser.fftSize = 512;
    nullAmp.connect(this.analyser);
    nullOsc.start(0);
  }
  initScopes() {
    this.frequencyScope = new FrequencyScope(this.analyser);
    this.frequencyScope.render();
    this.dataScope = new DataScope(this.analyser);
    this.dataScope.render()
  }
  initSlides() {
    this.slides = document.querySelectorAll('.slide');
    this.slideCount = this.slides.length;
    var i;
    for (i=1;i<this.slideCount;i++) {
      this.addClass(this.slides[i], 'before');
    }
    setTimeout(() => this.removeClass(document.body, 'init'), 0);
    this.currentSlideIndex = 0;
  }
  initSlide(slide) {
    var script = slide.querySelector('script');
    if (script) {
      var type = script.getAttribute('type');
      if (type == 'text/wa-autoplay') {
        eval(script.text);
        this.codeToExecuteOnButton = null;
      } else if (type == 'text/wa-button') {
        this.codeToExecuteOnButton = script.text;
      }
    } else {
      this.codeToExecuteOnButton = null;
    }
  }

  executeCode() {
    if (this.codeToExecuteOnButton) {
      var code = "(function(ac, analyser) {" + this.codeToExecuteOnButton + ";})(this.ac, this.analyser)";
      eval(code);
    }
  }

  initKeyboardListeners() {
    document.addEventListener('keydown', (e) => {
      if (e.which === 34 || e.which === 39) {
        this.nextSlide()
      } else if (e.which === 33 || e.which === 37) {
        this.prevSlide();

      } else if (e.which === 13 || e.which === 66) {
        this.executeCode();
      } else {
        console.log("Not Implemented", e.which);
      }
    }, false)
  }

  nextSlide() {
    if ((this.currentSlideIndex + 1) >= this.slideCount) return;
    var previous = this.slides[this.currentSlideIndex];
    var next = this.slides[this.currentSlideIndex + 1];
    console.log(this.slides, next);
    if (previous) this.addClass(previous, 'after');
    if (next) this.removeClass(next, 'before');
    this.initSlide(next);
    this.currentSlideIndex++;
  }

  prevSlide() {
    if ((this.currentSlideIndex - 1) === 0) return;
    var previous = this.slides[this.currentSlideIndex];
    var next = this.slides[this.currentSlideIndex - 1];
    if (previous) this.addClass(previous, 'before');
    if (next) this.removeClass(next, 'after');
    this.initSlide(next);
    this.currentSlideIndex--;
  }

  addClass(node, klass) {
    var classes = node.className.split(" ");
    if (classes.indexOf(klass) === -1) {
      node.className += (" " + klass);
    }
  }

  removeClass(node, klass) {
    var classes = node.className.split(" ");
    if (classes.indexOf(klass) !== -1) {
      var pos = classes.indexOf(klass);
      console.log(classes, pos, classes.splice())
      classes.splice(pos, 1);
      console.log(classes);
      node.className = classes.join(" ");
    }
  }

}



class FrequencyScope {
  constructor(analyser) {
    this.analyser = analyser;
    this.bufferLength = this.analyser.frequencyBinCount;
    this.binArray = new Uint8Array(this.bufferLength);
    this.cvs = document.getElementById('fftscope');
    this.ctx = this.cvs.getContext('2d');
    this.fftBarWidth = this.cvs.width / this.bufferLength * 0.8;
  }
  render() {
    console.log(this.render);
    requestAnimationFrame(()=> this.render())
    this.ctx.clearRect(0,0,this.cvs.width, this.cvs.height);
    this.analyser.getByteFrequencyData(this.binArray);
    var x,y;
    this.binArray.forEach(function(value, i) {
      x = i * 1.0 / this.bufferLength * this.cvs.width;
      y = value / 255.0 * this.cvs.height;
      this.ctx.fillStyle = "hsl(" + (i * 1.0 / this.bufferLength * 360) +", 100%, 50%)";
      this.ctx.fillRect(x, this.cvs.height - y, this.fftBarWidth, y);
    }, this)
  }
}
class DataScope {
  constructor(analyser) {
    this.analyser = analyser;
    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);
    this.cvs = document.getElementById('scope');
    this.ctx = this.cvs.getContext('2d');
  }
  render() {
    requestAnimationFrame(()=> this.render())
    this.ctx.fillStyle = "rgba(255,255,255,0.5)"
    this.ctx.fillRect(0, 0, this.cvs.width, this.cvs.height);
    this.analyser.getByteTimeDomainData(this.dataArray);
    var x,y;
    this.ctx.strokeStyle = "#000";
    this.ctx.beginPath();
    this.dataArray.forEach(function(value, i) {
      x = i * 1.0 / this.bufferLength * this.cvs.width;
      y = value / 255.0 * this.cvs.height;
      if (i === 0) {
        this.ctx.moveTo(x,y)
      } else {
        this.ctx.lineTo(x,y)
      }
    }, this);
    this.ctx.stroke();
  }
}

addEventListener('load', function() {
  new WebAudioPresenter();
}, false);
