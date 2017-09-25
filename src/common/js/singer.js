export default class Singer {                                          //创建歌手数据的一个函数
  constructor({id, name}) {                                            //解构赋值 等调用的时候 传入指定的id数据和name数据
    this.id = id
    this.name = name
    this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
  }
}