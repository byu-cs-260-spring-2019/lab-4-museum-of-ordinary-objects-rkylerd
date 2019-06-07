var app = new Vue({
  el: '#admin',
  data: {
    title: "",
    editTitle:'',
    description: '',
    editDescription:'',
    selected:  "",
    addItem: null,
    findTitle: "",
    findItem: null,
    photos: [
      {name: 'surprise', id: 9, path: 'https://dogemuchwow.com/wp-content/uploads/2016/05/cropped-the-doge-favicon-blue.png'},
      {name: 'baseball', id: 1, path: './images/baseball.jpg'},
      {name: 'selena', id: 10, path:'https://peppermintfrostblog.files.wordpress.com/2015/09/disney-s-wizards-with-hannah-montana-a-new-series-begins-selena-gomez-10886345-1024-768.jpg'},
      {name:'styx', id: 11, path: 'https://www.music-bazaar.com/album-images/vol31/1147/1147720/3014923-big/Live-In-Chicago-1977-Fm-Radio-Broadcast-The-Grand-Illusion-Live-cover.jpg'},
      {name: 'car', id: 2, path: './images/red_car.jpg'},
      {name: 'glasses', id: 3, path: './images/glasses.jpg'},
      {name: 'paintbrush', id: 4, path: './images/paint_brush.jpg'},
      {name: 'pen', id: 5, path: './images/ball_pen.jpg'},
      {name: 'native_american', id: 6, path: 'https://localtvkfor.files.wordpress.com/2014/06/nativeamerican.jpg?quality=85&strip=all'},
      {name: 'shovel', id: 7, path: './images/shovel.jpg'},
      {name: 'slinky', id: 8, path: './images/slinky.jpg'},
      
    ],
    items: [],
  },
  created() {
    this.getItems();
  },
  methods: {
    async addNewItem(){
      this.items.push({title:this.title, path:this.selected.path, description: this.description});
      try {
        console.log("selected: ",this.selected);
        let result = await axios.post('/api/items', {
          title: this.title,
          description: this.description,
          path: this.selected.path
        });
        this.addItem = result.data;
        await this.getItems();
      } catch (error) {
        console.log(error);
      }
    },
    async getItems() {
      
      try {
        let response = await axios.get("/api/items");
        this.items = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }

    },
    selectItem(item) {
      this.findTitle = "";
      this.findItem = item;
    },
    async deleteItem(item) {
      try {
        let response = await axios.delete("/api/items/" + item.id);
        this.findItem = null;
        this.getItems();
        
        this.editTitle = '';
        this.editDescription = '';
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async editItem(item) {
      try {
        let response = await axios.put("/api/items/" + item.id, {
          title: this.editTitle,
          description: this.editDescription,
        });

        this.findItem = null;
        this.editTitle = '';
        this.editDescription = '';
        this.getItems();
        return true;
      } catch (error) {
        console.log(error);
      }
    },

  },
  computed: {
    suggestions() {
      return this.items.filter(item => item.title.toLowerCase().startsWith(this.findTitle.toLowerCase()));
    }
  },
});
