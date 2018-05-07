/**
 * Audio Player component which will handle the audio field in the document
 * @export
 * @class
 * @author Jamil.A
 */

import { Component, NgZone } from '@angular/core';

@Component({
    selector: 'audio-player',
    templateUrl: 'audio-player.component.html'
})

export class AudioPlayerComponent {
    private files: string[] = ['assets/audio/slum.wav', 'assets/audio/down_to_cases.wav', 'assets/audio/strawberries.wav'];
    private sound: HTMLAudioElement;
    public track: number;
    public duration: any;
    public trackDisabled: Boolean = true;
    public isPlaying: boolean = false;
    public time: any;

    constructor(private _ngZone: NgZone) { }

    public async control() {
        if (!this.isPlaying) {
            if (!this.sound) {
                await this.initAudioObject(this.files[0]);
            } else {
                this.setCurrentTime(this.track * this.duration / 100);
            }
            this.play();
            this.setFlags(true);
        } else {
            this.pause();
            this.setFlags(false);
        }

    }
    public seekTo(e) {
        this.setCurrentTime(e.value * this.duration / 100);
    }
    private play() {
        this.sound.play();
    }
    private setFlags(flag: boolean) {
        this.isPlaying = flag;
        this.trackDisabled = !flag;
    }
    private pause() {
        this.sound.pause();
    }
    private setEvents() {
        this.sound.ontimeupdate = e => {
            this.setTime(Math.floor(this.duration - this.getCurrentTime()));
            this.track = Math.floor(this.getCurrentTime() / this.duration * 100);
            //if (device.platform == 'iOS') {
            // to handle the UI update on iOS
            //this._ngZone.run(() => { });
            //}
            console.log(this.track);
            if (this.getCurrentTime() == this.duration) {
                this.killSound();
            }
        }
    }
    private getCurrentTime() {
        return this.sound.currentTime;
    }
    private setCurrentTime(sec: number, play: boolean = true): void {
        this.sound.currentTime = sec;
        if (play) {
            this.play();
        }
    }
    private killSound() {
        this.clearEvents();
        this.track = 0;
        this.setCurrentTime(0, false);
        this.setFlags(false);
        this.sound = null;
    }
    private clearEvents() {
        this.sound.ontimeupdate = null;
    }
    private prepareSeconds(sec: number): number {
        return Math.round(sec);
    }
    private setTime(seconds: number) {
        seconds = this.prepareSeconds(seconds);
        let hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        let minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        this.time = this.formatTime(hours, minutes, seconds);
    }
    private formatTime(h: number, m: number, s: number): string {
        let time: string = '';
        if (h > 0) {
            time += ('0' + h).slice(-2) + ':';
        }
        return time + ('0' + m).slice(-2) + ':' + ('0' + s).slice(-2);
    }
    private initAudioObject(file: string) {
        return new Promise((resolve, reject) => {
            if (this.sound) {
                resolve();
            }
            this.sound = new Audio(file);
            this.sound.onloadedmetadata = e => {
                this.duration = this.sound.duration;
                this.setTime(this.sound.duration);
                this.setEvents();
                resolve();
            }
        });
    }
}
