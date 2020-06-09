export class Video {
  public id: string;
  public name: string;
  public duration: string;
  public size: string;
  public format: string;
  public date: string;
  public info: string[];
  public description: string;
  public thumb: string;
  public videoUrl: string;
  public subs: Array<{}>;

  constructor(id: string, name: string, duration: string, size: string, format: string, date: string, info: string[],
    description: string, thumb: string, videoUrl: string, subs: Array<{}>) {
    this.id = id;
    this.name = name;
    this.duration = duration;
    this.size = size;
    this.format = format;
    this.date = date;
    this.description = description;
    this.info = info;
    this.thumb = thumb;
    this.videoUrl = videoUrl;
    this.subs = subs
  }
}