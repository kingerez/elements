/** @jsx elements.createElement */
import elements, { init, BaseElement } from './index'; 

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'mm-video-el': Element.JSX;
      'mm-poop': Element.JSX;
    }
  }
}

class Poop extends BaseElement {
  constructor() {
    super();
  }

  render(): Element.JSX | null {
    return <h1>Poop</h1>;
  }
}

customElements.define('mm-poop', Poop);

class MMVideoElement extends BaseElement {
  constructor() {
    super();
  }

  buttonText = 'Play!';

  elementStyle: string | null = `
    mm-video-el {
      width: 100%;
      height: 100%;
      display: block;
      position: relative;
    }

    mm-video-el video {
      width: 100%;
    }

    mm-video-el .play-button {
      font-size: 50px;
      margin-top: 10px; 
    }

    #video-wrapper {
      position: relative;
    }

    #ad-container {
      position: absolute;
      top: 0;
      left: 0;
    }
  `;

  videoRef = this.createRef<HTMLVideoElement>(null);
  adContainerRef = this.createRef<HTMLDivElement>(null);
  adContainer = null;
  adDisplayContainer = null;
  adsLoader = null;
  adsManager = null;

  onMount() {
    this.adDisplayContainer = new google.ima.AdDisplayContainer(this.adContainerRef.current, this.videoRef.current);
    this.adsLoader = new google.ima.AdsLoader(this.adDisplayContainer);

    this.videoRef.current.addEventListener('ended', () => {
      this.adsLoader.contentComplete();
    });

    const adsRequest = new google.ima.AdsRequest();
    adsRequest.adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads?' +
      'iu=/21775744923/external/single_ad_samples&sz=640x480&' +
      'cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&' +
      'gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=';

    const videoElement = this.videoRef.current;
    adsRequest.linearAdSlotWidth = videoElement.clientWidth;
    adsRequest.linearAdSlotHeight = videoElement.clientHeight;
    adsRequest.nonLinearAdSlotWidth = videoElement.clientWidth;
    adsRequest.nonLinearAdSlotHeight = videoElement.clientHeight / 3;
  
    // Pass the request to the adsLoader to request ads
    this.adsLoader.requestAds(adsRequest);
    this.adsLoader.addEventListener(
      google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
      (e) => {
        this.adsManager = e.getAdsManager(this.videoRef.current);
        this.adsManager.init(videoElement.clientWidth, videoElement.clientHeight, google.ima.ViewMode.NORMAL);
        this.adsManager.start();
      },
      false);
  }

  onClick = () => {
    this.buttonText = 'poop';
    this.videoRef?.current.play();
    this.update();
  }

  render(): Element.JSX | null {
    return (
      <div>
        <mm-poop></mm-poop>
        <div id="video-wrapper">
          <video ref={this.videoRef}>
            <source src="https://storage.googleapis.com/interactive-media-ads/media/android.mp4"></source>
            <source src="https://storage.googleapis.com/interactive-media-ads/media/android.webm"></source>
          </video>
          <div id="ad-container" ref={this.adContainerRef} />
        </div>
        <div className='play-button' onClick={this.onClick}>{this.buttonText}</div>
      </div>
    );
  }
}

customElements.define('mm-video-el', MMVideoElement);

const app = () => <mm-video-el></mm-video-el>;

init(document.querySelector('div') as HTMLElement, app);

// interface MMWrapperProps extends Element.JSX {
//   shludu?: any;
// }

// declare global {
//   namespace JSX {
//     interface IntrinsicElements {
//       'mm-wrapper': MMWrapperProps;
//       'mm-wrapper-child': Element.JSX;
//     }
//   }
// }

// class MMWrapperChild extends BaseElement {
//   constructor() {
//     super();
//   }

//   elementStyle: string | null = 'mm-wrapper-child {padding: 10px; font-size: 20px; background-color: pink; width: 100%; display: block}';

//   render() {
//     return <div>Hello!</div>;
//   }
// }

// customElements.define('mm-wrapper-child', MMWrapperChild);


// const ELEMENT = 'mm-wrapper';

// class MMWrapper extends BaseElement {
//   constructor() {
//     super();
//   }

//   elementStyle = `
//     ${ELEMENT} {
//       width: 100%;
//       display: block;
//     }
//   `;

//   render() {
//     return <mm-wrapper-child />;
//   }
// }

// customElements.define(ELEMENT, MMWrapper);

// const test = () => {
//   return (
//     <mm-wrapper />
//   );
// };

// init(document.querySelector('div') as HTMLElement, test);
