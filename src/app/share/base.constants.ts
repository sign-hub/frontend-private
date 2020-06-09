export class Baseconst {
  private static protocol = 'http';
  private static url: string = 'testing01.eclettica.net';
  private static frontend_url = 'localhost:4200';
  private static api_path = '/api/rest';
  // private static url = 'testing.sign-hub.eu';
  //public static url: string = '54.76.141.222:9000';
  //private static api_path: string = '';
  //private static url: string = 'localhost:9000';

  private static isProd: boolean = true;

  public static getCompleteBaseUrl = function () {
    /*this.url = '10.6.0.152:9000';
    this.api_path = '';*/

    if (this.isProd) {
      return this.api_path + '/';
    }
    return Baseconst.protocol + '://' + Baseconst.url + this.api_path + '/';
  };

  public static getPartialBaseUrl = function () {
    if (this.isProd) {
      return this.api_path;
    }
    return Baseconst.protocol + '://' + Baseconst.url + this.api_path;
  };
}
