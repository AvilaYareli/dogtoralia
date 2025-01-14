import { mapState } from "vuex";
import { layoutClasses } from "@/constants/layout";
console.log('cargando navMenu.js');
const navMenu = {
  data() {
    return {
      layoutobj: {},
    };
  },
  computed: {
    ...mapState({
      // sidebarType:(state)=>state.layout.sidebar,
      menuItems: (state) => state.menu.data,
      layout: (state) => state.layout.layout,
      sidebar: (state) => state.layout.sidebarType,
      activeoverlay: (state) => state.menu.activeoverlay,
      togglesidebar: (state) => state.menu.togglesidebar,
      width: (state) => state.menu.width,
      height: (state) => state.menu.height,
      margin: (state) => state.menu.margin,
      menuWidth: (state) => state.menu.menuWidth,
      message () {
        console.log("aA")
        return this.$store.state.message
      }
    }),
    sidebarType(){
      return this.$route.query.layout || 'default'
    },
    layoutobject: {
      get: function () {
        return JSON.parse(
          JSON.stringify(
            layoutClasses.find(
              (item) => Object.keys(item).pop() === this.layout.settings.layout
            )
          )
        )[this.layout.settings.layout];
      },
      set: function () {
        this.layoutobj = layoutClasses.find(
          (item) => Object.keys(item).pop() === this.layout.settings.layout
        );
        this.layoutobj = JSON.parse(JSON.stringify(this.layoutobj))[
          this.layout.settings.layout
        ];
        return this.layoutobj;
      },
    },
  
  },  
  watch: {
      width() {
        window.addEventListener("resize", this.handleResize);
        this.handleResize();
        window.addEventListener("scroll", this.handleScroll);
        this.handleScroll();
        if (window.innerWidth < 992) {
          const newlayout = JSON.parse(
            JSON.stringify(this.layoutobject).replace(
              "horizontal-wrapper",
              "compact-wrapper"
            )
          );
          document.querySelector(".page-wrapper").className =
            "page-wrapper " + newlayout;
          this.$store.state.menu.margin = 0;
        } else {
          document.querySelector(".page-wrapper").className =
            "page-wrapper " + this.layoutobject;
        }
      },
    }, 
     created() {
      window.addEventListener("resize", this.handleResize);
      this.handleResize();

      this.$nextTick(() => {
      setTimeout(() => {
        const elmnt = document.getElementById("myDIV");
        if(elmnt){
          this.$store.state.menu.menuWidth = elmnt.offsetWidth;
          this.$store.state.menu.menuWidth > window.innerWidth
            ? ((this.$store.state.menu.hideRightArrow = false),
              (this.$store.state.menu.hideLeftArrowRTL = false))
            : ((this.$store.state.menu.hideRightArrow = false),
              (this.$store.state.menu.hideLeftArrowRTL = true));
        }else{
          console.error('Elemento "myDIV" no encontrado');
        }
      }, 500);
    });
      this.layoutobject = layoutClasses.find(
        (item) => Object.keys(item).pop() === this.layout.settings.layout
      );
      this.layoutobject = JSON.parse(JSON.stringify(this.layoutobject))[
        this.layout.settings.layout
      ];
    },
  mounted() { 
    this.menuItems.filter((items) => {
      if (items.path === this.$route.path)
        this.$store.dispatch("menu/setActiveRoute", items);
      if (!items.children) return false;
      items.children.filter((subItems) => {
        if (subItems.path === this.$route.path)
          this.$store.dispatch("menu/setActiveRoute", subItems);
        if (!subItems.children) return false;
        subItems.children.filter((subSubItems) => {
          if (subSubItems.path === this.$route.path)
            this.$store.dispatch("menu/setActiveRoute", subSubItems);
        });
      });
    });
    // const token = localStorage.getItem('token');
    // const userType = localStorage.getItem('userType');
    // if (token && userType) {
    //   this.$store.dispatch('menu/initializeMenu');
    // }

  },
  methods: {
    handleScroll() {
      if (window.scrollY > 400) {
        if (
          this.layoutobject.split(" ").pop() === "material-type" ||
          this.layoutobject.split(" ").pop() === "normal-sidebar"
        )
          document.querySelector(".sidebar-main").className =
            "sidebar-main hovered";
      } else {
        if (document.getElementById("sidebar-main"))
          document.querySelector(".sidebar-main").className = "sidebar-main";
      }
    },
    setNavActive(item) {
      this.$store.dispatch("menu/setNavActive", item);
      if (
        this.layoutobject.split(" ").includes("compact-sidebar") &&
        window.innerWidth > 991
      ) {
        if (this.menuItems.some((menuItem) => menuItem.active === true)) {
          this.$store.state.menu.activeoverlay = true;
        } else {
          this.$store.state.menu.activeoverlay = false;
        }
      }
    },  
      addMessage () {
          this.$store.dispatch('addMessage')
      }    
    ,
    hidesecondmenu() {
      if (window.innerWidth < 991) {
        (this.$store.state.menu.activeoverlay = false),
          (this.$store.state.menu.togglesidebar = false);
        this.menuItems.filter((menuItem) => {
          menuItem.active = false;
        });
      } else if (this.layoutobject.split(" ").includes("compact-sidebar")) {
        (this.$store.state.menu.activeoverlay = false),
          this.menuItems.filter((menuItem) => {
            menuItem.active = false;
          });
      }
    },
    handleResize() {
      this.$store.state.menu.width = window.innerWidth - 300;
    },
  }
 }
   
   export default navMenu