<div class="pprek24-loader"></div>

<style lang="scss">
  :global(.pprek24-loader) {
    --_clr: var(--clr-txt-100);
    --_clr-accent: var(--clr-accent-300);

    block-size: 1em;
    inline-size: 4em;
    position: relative;
    isolation: isolate;
    margin: 2rem auto;

    &::before {
      content: '';
      inline-size: 1em;
      aspect-ratio: 1;
      display: block;
      position: absolute;
      inset: 0 auto auto 1.5em;
      background-color: var(--_clr);
      border-radius: 50%;
      filter: drop-shadow(-1.5em 0 0 var(--_clr-accent)) drop-shadow(1.5em 0 0 var(--_clr));
      animation: shadowPulse 3s linear infinite;
    }
  }

  @keyframes shadowPulse {
    0%, 100% {
      filter: drop-shadow(-1.5em 0 0 var(--_clr-accent)) drop-shadow(1.5em 0 0 var(--_clr));
      background-color: var(--_clr);
    }
    33.33333% {
      filter: drop-shadow(-1.5em 0 0 var(--_clr)) drop-shadow(1.5em 0 0 var(--_clr));
      background-color: var(--_clr-accent);
    }
    66.66667% {
      filter: drop-shadow(-1.5em 0 0 var(--_clr)) drop-shadow(1.5em 0 0 var(--_clr-accent));
      background-color: var(--_clr);
    }
  }
</style>
