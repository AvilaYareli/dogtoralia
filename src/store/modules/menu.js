import Menu from "../../data/menu.json"
console.log('menu.js');

const state ={
data:Menu.data,
togglesidebar: true,
  activeoverlay : false,
  customizer: '',
  searchData: [],
  searchOpen : false,
  hideRightArrowRTL: false,
  hideLeftArrowRTL: true,
  hideRightArrow: true,
  hideLeftArrow: true,
  width: 0,
  height: 0,
  margin: 0,
  menuWidth: 0,
  //  message: 'Message test'
   newMessage:'Message test'
};
const mutations = {

  setData: (state, userType) => {
   
    if (userType === 'pet_owner') {
      state.data = Menu.dataUser;
    } else {
      state.data = Menu.dataAdmin
    }
    
  },   
  newMessage (state) {
    console.log("yaaaa por favor!!" , state)
    state.message = new Date()
   },

  searchTerm: (state, term) => {

    let items = [];
    var searchval = term.toLowerCase();
    state.data.filter(menuItems => {
      
      if (menuItems.title) {
        if (menuItems.title.toLowerCase().includes(searchval) && menuItems.type === 'link')  {
          items.push(menuItems);
        }
        if (!menuItems.children) return false;
        menuItems.children.filter(subItems => {
          if (subItems.title.toLowerCase().includes(searchval) && subItems.type === 'link') {
            subItems.icon = menuItems.icon;
            items.push(subItems);
          }
          if (!subItems.children) return false;
          subItems.children.filter(suSubItems => {
            if (suSubItems.title.toLowerCase().includes(searchval)){
              suSubItems.icon = menuItems.icon;
              items.push(suSubItems);
            }
          });
        });
        state.searchData = items;
      }
    });
  },
  opensidebar: (state) => {
    console.log("sasasasa")
    state.togglesidebar = !state.togglesidebar;
    if (window.innerWidth < 991) {
      state.activeoverlay = true;
    } else {
      state.activeoverlay = false;
    }
  },
  resizetoggle: (state) => {
    if (window.innerWidth < 1199) {
      state.togglesidebar = false;
    } else {
      state.togglesidebar = true;
    }
  },
  setNavActive: (state, item) => {
    if (!item.active) {
      state.data.forEach(a => {
        if (state.data.includes(item))
          a.active = false;
        if (!a.children) return false;
        a.children.forEach(b => {
          if (a.children.includes(item)) {
            b.active = false;
          }
        });
      });
    }
    item.active = !item.active;
  },
  setActiveRoute: (state, item) => {
    state.data.filter(menuItem => {
      if (menuItem !== item)
        menuItem.active = false;
      if (menuItem.children && menuItem.children.includes(item))
        menuItem.active = true;
      if (menuItem.children) {
        menuItem.children.filter(submenuItems => {
          if (submenuItems.children && submenuItems.children.includes(item)) {
            menuItem.active = true;
            submenuItems.active = true;
          }
        });
      }
    });
  }
};
const actions = {
 
  setNavActive: (context,item) => {
    context.commit('setNavActive', item);
  },
  opensidebar: (context, term) => {
    context.commit('opensidebar', term);
  },
  resizetoggle: (context, term) => {
    context.commit('resizetoggle', term);
  },
  searchTerm: (context, term) => {
    context.commit('searchTerm', term);
  },

  initializeMenu({ commit }) {
    const token = localStorage.getItem('token');
    if (token) {
      const role = localStorage.getItem('userType');
      commit('setData', role); // Pass role to set the appropriate menu
    }
  },

  addMessage ({commit}) {
    commit('newMessage')
}
  
};
// dispatchEvent("",true,{});

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    
  };
  