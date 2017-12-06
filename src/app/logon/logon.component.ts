import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../Model/user';
import { RunningManService } from '../service/running-man.service';

@Component({
  selector: 'app-logon',
  templateUrl: './logon.component.html',
  styleUrls: ['./logon.component.css']
})
export class LogonComponent implements OnInit {
  username: string;
  password: string;
  bgSound: string;
  efSound: string;
  isHidden = true;
  domStartAudio: HTMLAudioElement = <HTMLAudioElement> document.querySelector('#startaudio');
  domPreparetAudio: HTMLAudioElement = <HTMLAudioElement> document.querySelector('#prepareaudio');
  domStepAudio: HTMLAudioElement = <HTMLAudioElement> document.querySelector('#stepaudio');

  constructor(
    private runningManService: RunningManService,
    private router: Router
  ) { }

  ngOnInit() {
    this.bgSound = '1';
    this.efSound = '1';
    this.domStartAudio.setAttribute('play', this.bgSound);
    this.domPreparetAudio.setAttribute('play', this.bgSound);
    this.domStepAudio.setAttribute('play', this.efSound);
  }

  newUser() {
    this.runningManService.addUser({
      username: this.username,
      password: this.password
    })
    .then((data) => data.status === 0 ? alert('Success!') : alert(data.message));
  }

  toGame() {
    this.runningManService.logon({
      username: this.username,
      password: this.password
    })
    .then((data) => {
      if (data.status === 0 ) {
        this.router.navigate(['/game', this.username]);
      } else {
        alert(data.message);
      }
    });
  }

  chagebgSound(value: string) {
    value === '0' ? this.domStartAudio.pause() : this.domStartAudio.play();
    this.domStartAudio.setAttribute('play', value);
    this.domPreparetAudio.setAttribute('play', value);

  }

  chageefSound(value: string) {
    this.domStepAudio.setAttribute('play', value);
  }

  showSetting() {
    this.isHidden = !this.isHidden;
  }

}
