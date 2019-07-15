import { Injectable } from '@angular/core';
import { TodoService } from './todo.service';

@Injectable({
  providedIn: 'root'
})
export class CountdownService {

  constructor(public todoService: TodoService) { }

  // 番茄鐘時間
  workTime = 60000;
  breakTime = 60000;

  // 紀錄剩餘番茄鐘時間
  limitWorkTime = 60000;
  limitBreakTime = 60000;

  limitCountDownTime = 0;

  // 紀錄開始的時間和結束時間
  startTime;
  endTime;

  // 正在計時
  isCountDown = false;
  countDownStatus = "work";
  isEndCountDown = true;

  // 輸出時間
  showCountDownTime = (new Date(this.workTime).getMinutes() < 10 ? '0'+new Date(this.workTime).getMinutes():new Date(this.workTime).getMinutes()) + ':' + (new Date(this.workTime).getSeconds() < 10? '0'+new Date(this.workTime).getSeconds():new Date(this.workTime).getSeconds());

  // 計時器
  countDownInterval;

  // 剩餘秒數(動畫)
  limitSeconds;
  limitPercent;
  
  workaudio = 'default';
  breakaudio = 'default';

  startCountDown() {
    let countDownTime = 0;
    if (this.countDownStatus === "work") {
      countDownTime = this.workTime;
    } else if (this.countDownStatus === "break") {
      countDownTime = this.breakTime;
    }
    // 結束時間 = 現在時間 + (番茄鐘時間 - 已經倒數時間)
    this.startTime = new Date();
    this.endTime = new Date(new Date().getTime() + (countDownTime - this.limitCountDownTime));
    this.limitSeconds = new Date(new Date(this.endTime).getTime() - new Date().getTime()).getTime() / 1000;
    this.limitPercent = (countDownTime - this.limitCountDownTime) / countDownTime * 100 + ",100";
    this.isCountDown = true;
    this.countDownInterval = setInterval(() => { this.countDownTimer(); },100);
  }

  stopCountDown() {
    clearInterval(this.countDownInterval);
    let countDownTime = 0;
    if (this.countDownStatus === "work") {
      countDownTime = this.workTime;
    } else if (this.countDownStatus === "break") {
      countDownTime = this.breakTime;
    }
    this.limitCountDownTime =  countDownTime - (new Date(new Date(this.endTime).getTime() - new Date().getTime()).getTime());
    this.isCountDown = false;
  }

  countDownTimer() {
    if(new Date(this.endTime) < new Date()) {
      clearInterval(this.countDownInterval);
      this.todoService.addTodoTomoto();
      this.limitCountDownTime =  0;
      this.isCountDown = false;
      let showTime;
      if(this.countDownStatus === "work") {
        this.countDownStatus = "break";
        showTime = this.breakTime;
        this.playAudio('work');
      } else if (this.countDownStatus === "break") {
        this.countDownStatus = "work";
        showTime = this.workTime;
        this.playAudio('break');
      }
      this.showCountDownTime = (new Date(showTime).getMinutes() < 10 ? '0'+new Date(showTime).getMinutes():new Date(showTime).getMinutes()) + ':' + (new Date(showTime).getSeconds() < 10? '0'+new Date(showTime).getSeconds():new Date(showTime).getSeconds());
      return;
    }
    let nowTime = this.endTime - new Date().getTime() + 1000;
    this.showCountDownTime = (new Date(nowTime).getMinutes() < 10 ? "0"+new Date(nowTime).getMinutes():new Date(nowTime).getMinutes()) + ":" + (new Date(nowTime).getSeconds() < 10 ? "0"+new Date(nowTime).getSeconds():new Date(nowTime).getSeconds())
  }

  endCountDown() {
    this.limitCountDownTime =  0;
    this.isCountDown = false;
    this.limitPercent = (this.workTime - this.limitCountDownTime) / this.workTime * 100 + ",100";
    if (this.countDownStatus === "break") {
      this.countDownStatus = "work";
    }
    this.showCountDownTime = (new Date(this.workTime).getMinutes() < 10 ? '0'+new Date(this.workTime).getMinutes():new Date(this.workTime).getMinutes()) + ':' + (new Date(this.workTime).getSeconds() < 10? '0'+new Date(this.workTime).getSeconds():new Date(this.workTime).getSeconds());
    clearInterval(this.countDownInterval);
  }

  playAudio(type){
    let audio = new Audio();
    if(type == 'work') {
      audio.src = "/assets/" + this.workaudio + ".mp3";
    } else if (type == 'break') {
      audio.src = "/assets/" + this.breakaudio + ".mp3";
    }
    audio.play();
  }
}
