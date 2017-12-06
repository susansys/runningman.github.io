import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RunningManService } from '../service/running-man.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  timeNow: number;
  worldRecord: number;
  userBestRecord: number;
  username: string;

  $man;
  $box;
  $tag;
  step = 0;
  cont = 0;

  // domRunMan: HTMLDivElement = <HTMLDivElement> document.querySelector('#runMan');
  domStartAudio: HTMLAudioElement = <HTMLAudioElement> document.querySelector('#startaudio');
  domPreparetAudio: HTMLAudioElement = <HTMLAudioElement> document.querySelector('#prepareaudio');
  domStepAudio: HTMLAudioElement = <HTMLAudioElement> document.querySelector('#stepaudio');

  isStepPaly: string;
  timeInterval = null;
  runDistance = 0;
  runManSatus = {
    prepare: true,
    left: false,
    right: false,
    fall: false
  };
  userInterVal = null;

  constructor(
    private runningManService: RunningManService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.username = this.activatedRoute.snapshot.params['username'];
    this.$man = <HTMLElement> document.querySelector('#runMan');
    this.$box = <HTMLElement> document.querySelector('.box');
    this.$tag = <HTMLElement[]> Array.from(document.querySelectorAll('.tag'));
    this.timeNow = 0;
    this.domStartAudio.pause();
    this.domPreparetAudio.getAttribute('play') === '1' ? this.domPreparetAudio.play() : this.domPreparetAudio.pause();
    this.isStepPaly = this.domStepAudio.getAttribute('play');

    this.runningManService.getWorldRecord()
      .then((data) => data.status === 0
        ? this.worldRecord = data.data[0] ? data.data[0].record : 0
        : alert(data.message));

    this.runningManService.getUserRecord(this.username)
    .then((data) => data.status === 0
      ? this.userBestRecord = data.data.userrecord
      : alert(data.message));
  }

  startCalc() {
    if (this.timeInterval === null) {
      this.domPreparetAudio.pause();
      this.timeInterval = setInterval(() => { this.timeNow++; }, 1000);
    }
  }

  movePic() {
    this.step += 2;
    this.cont++;
    this.$man.style.transform = 'translateX(' + this.step + 'px)';
    this.$tag.forEach((tag) => tag.style.transform = 'translateX(-' + this.step * 2 + 'px)');
    this.$box.style.backgroundPosition =  -this.step * 2 + 'px 0px';
    if (this.cont >= 150) {
      this.timeInterval = null;

      this.runningManService.update({username: this.username, record: this.timeNow})
      .then((data) => data.status === 0
        ? ''
        : alert(data.message));

      this.router.navigate(['/socreboard', this.username, this.timeNow]);
    }
  }

  move(leg) {
    this.startCalc();
    if (this.runManSatus.fall) {
      return;
    }
    // Click one button continuously 2 times or Click too fast
    if (this.runManSatus.right && (leg === 'right')
    || this.runManSatus.left && (leg === 'left')
    || this.userInterVal !== null) {
      this.runManSatus = {
        prepare: false,
        left: false,
        right: false,
        fall: true
      };
      setTimeout(() => {
        this.runManSatus = {
          prepare: true,
          left: false,
          right: false,
          fall: false
        };
      }, 2000);
      return;
    }

    if (leg === 'right') {
      this.runManSatus.left = false;
      this.runManSatus.prepare = false;
      this.runManSatus.right = true;
      // this.runDistance += 20;
      // this.domRunMan.style.transform = 'translateX(' + this.runDistance + 'px)' ;
      if (this.isStepPaly === '1') {
        this.domStepAudio.play();
      }
      this.movePic();
      this.userInterVal = setTimeout(() => { this.userInterVal = null; }, 200);
    }

    if (leg === 'left') {
      this.runManSatus.prepare = false;
      this.runManSatus.right = false;
      this.runManSatus.left = true;
      // this.runDistance += 20;
      // this.domRunMan.style.transform = 'translateX(' + this.runDistance + 'px)' ;
      if (this.isStepPaly === '1') {
        this.domStepAudio.play();
      }
      this.movePic();
      this.userInterVal = setTimeout(() => { this.userInterVal = null; }, 200);
    }

  }



}
