import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RunningManService } from '../service/running-man.service';

@Component({
  selector: 'app-score-board',
  templateUrl: './score-board.component.html',
  styleUrls: ['./score-board.component.css']
})
export class ScoreBoardComponent implements OnInit {

  domStartAudio: HTMLAudioElement = <HTMLAudioElement> document.querySelector('#startaudio');
  domPreparetAudio: HTMLAudioElement = <HTMLAudioElement> document.querySelector('#prepareaudio');
  domStepAudio: HTMLAudioElement = <HTMLAudioElement> document.querySelector('#stepaudio');

  username;
  userrecord;

  user;
  records;

  constructor(
    private router: Router,
    private runningManService: RunningManService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.domPreparetAudio.pause();
    this.domStartAudio.pause();
    this.domStepAudio.pause();
    this.username = this.activatedRoute.snapshot.params['username'];
    this.userrecord = this.activatedRoute.snapshot.params['userrecord'];

    this.runningManService.getWorldRecord()
    .then((data) => data.status === 0
      ? this.records = data.data
      : alert(data.message));

    this.runningManService.getUserRecord(this.username)
    .then((data) => data.status === 0
      ? this.user = data.data
      : alert(data.message));
  }

  toGame() {
    this.router.navigate(['/game', this.username]);
  }

}
