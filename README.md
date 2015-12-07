# Web Audio Presenter

A small, opinionated and not-quite-done yet presentation tool for talking about Web Audio

- Comes with a preinitialized web audio context
- Code can be autoplayed or executed by hitting ENTER after entering a slide
- kitschy fft and scope visualization for generated audio

## Usage

Basically there are two types of slides: Text slides and code slides with executable code:

Example text slide:

```html
<div class="slide text">
  <ul>
    <li>Basic Synthesis</li>
    <li>Compound Effects</li>
    <li>Maths &amp; Complex Things</li>
  </ul>
</div>
```

(should be self explanatory)

Example code slide:

```html
<div class="slide">
  <pre><code class="js">
var osc = ac.createOscillator();
osc.type="sawtooth";
osc.connect(ac.destination);
osc.start(0)
osc.stop(ac.currentTime + 2);
  </code>
  <script type="text/wa-button">
  var osc = wa.createOscillator();
  osc.type="square";
  osc.frequency.value = 220;
  osc.connect(analyser);
  osc.connect(wa.destination);
  osc.start(0)
  osc.stop(wa.currentTime + 2);
  </script>
</div>
```
the &lt;pre><code&gt; block is code highlighted (only javascript).
The script-block is executable code that may use the internal tools

There are two types of script blocks: `"text/wa-button"` gets played when pressing ENTER (also supports
the STOP/Blank button on Kensington Remotes), `"text/wa-autoplay"` gets played automatically on transition.

## Extras

You can use the following variables, as the code is eval'd in the correct scope:

- wa is the AudioContext. (And thus wa.destination is the soundcard)
- analyser is the AnalyserNode that powers the scope and fft display

## TODO

- Transform the horrible slide show code into something a little more structured
- Provide a few basic building blocks to make it easier to demonstrate complex code
- Maybe provide some basic sliders or something, elements to show the effect of params.

## License

See [LICENSE](LICENSE)
