//#region checkWindowSize
const checkWindowSize = (e) => {
    return window.matchMedia(e).matches;
}
const checkMobileSize = () => {
    let query = '(max-width: 767px)';
    var rs = checkWindowSize(query);
    return rs;
}
const checkTabletSize = () => {
    let query = '(min-width: 768px) and (max-width: 1024px)';
    var rs = checkWindowSize(query);
    return rs;
}
const checkPortraitTabletSize = () => {
    let query = '(max-width: 991px) and (orientation: portrait)';
    var rs = checkWindowSize(query);
    return rs;
}
//#endregion checkWindowSize
const OW_PIC_SLIDER = {
    listadoItems: document.querySelectorAll(".owSlider"),      // querySelector al contenedor
    query: ".owSlider-item",                                        // query para hacer queryselector del item
    init: 0,
    show: {
        mobile: 1,
        tablet: 1,
        default: 1,
        custom: []
    },                                                    // Item desde el que inicializar el slider
    timeout: {
        mobile: 500,
        tablet: 500,
        default: 500,
        custom: []
    },  
    options: { 
        mode: "vue",    // [default|solo]
        loop: true,
        finger: true,
        nav: {
            buttons: true,
            arrows: true,
        },                                     
        autoplay: {                                                     // Funciones autoplay
            estado: false,                                              // true|false => Activar o no
            query: window.matchMedia('(max-width: 767px)').matches,     // true|false => Desactivar si es true (combinar con window.MatchMeadia)
            time: 5000 },                                               // tiempo en milisegundos entre rotacion y rotacion
        overflow: {                                                     // Activar overflow
            estado: false,                                              // Mostrar en true los elementos Pre/post
            items: 1,                                                   // Items para mostrar
            query: window.matchMedia('(min-width: 1367px)').matches,    // true|false => Desactivar si es true (combinar con window.MatchMeadia)
        },
        modeSolo: { // Funciones solo
            mini: false // Mostrar miniaturas [true|false]:
        },
        modeVue: {  // Configuración vue
            mini: false,
        }

    },
    customMedias: [
        {query: '(min-width: 1024px) and (max-width: max-width: 1279px)', show:1, timeout: 500},
        {query: '(min-width: 1280px) and (max-width: 1365px)', show:1, timeout: 500}
    ]
};




class vueSlider
{
    /**
     * Esta función toma un objeto como argumento y asigna las propiedades del objeto a las propiedades
     * de la clase.
     * @param data - {
     */
    constructor( data )
    {
        this.itemsQuery = data.query
        this.init = data.init ? data.init : 0
        this.show = data.show ? data.show : {
            mobile: 1,
            tablet: 1,
            default: 1
        }
        this.timeout = data.timeout ? data.timeout : {
            mobile: 500,
            tablet: 500,
            default: 500
        }
        
        this.configOptions( data )

        this.sliderList = []

        this.options.listadoItems = data.listadoItems
        this.options.resizeCtrl = false;

    }

    
    //#region Configs

    configOptions ( data )
    {
        this.options = {
            loop: typeof data.options != "undefined" && typeof data.options.loop != "undefined" ? data.options.loop : true,
            finger: typeof data.options != "undefined" && typeof data.options.finger != "undefined" ? data.options.finger : false,
            nav: typeof data.options != "undefined" ? {
                buttons: typeof data.options.nav.buttons != "undefined" ? data.options.nav.buttons : true,
                arrows: typeof data.options.nav.arrows != "undefined" ? data.options.nav.arrows : true,
            }
                : {
                    buttons: true,
                    arrows: true,
                },
           
        }
        
        this.configAutoplay( data )

        this.configOverflow( data )

        this.configModo( data )
    }

    configAutoplay ( data )
    {
        this.options.autoplay = typeof data.options != "undefined"
            ? {    // Funciones autoplay
                estado: typeof data.options.autoplay.estado != "undefined" ? data.options.autoplay.estado : false,  // true|false => Activar o no
                query: typeof data.options.autoplay.query != "undefined" ? data.options.autoplay.query : false,     // true|false => Desactivar si es true (combinar con window.MatchMeadia)
                time: typeof data.options.autoplay.time != "undefined" ? data.options.autoplay.time : 5000
            }
            : {                 // Funciones autoplay
                estado: false,          // true|false => Activar o no
                query: false,           // true|false => Desactivar si es true (combinar con window.MatchMeadia)
                time: 5000             // tiempo en milisegundos entre rotacion y rotacion
            }

        // Corrección Legacy data estructure
        this.options.autoplay.estado = typeof data.autoplay != "undefined" && typeof data.autoplay.estado != "undefined" ? data.autoplay.estado : this.options.autoplay.estado
        this.options.autoplay.query = typeof data.autoplay != "undefined" && typeof data.autoplay.query != "undefined" ? data.autoplay.query : this.options.autoplay.query
        this.options.autoplay.time = typeof data.autoplay != "undefined" && typeof data.autoplay.time != "undefined" ? data.autoplay.time : this.options.autoplay.time
         
    }

    configOverflow ( data )
    {

        this.options.overflow = typeof data.options != "undefined"
            ? {                                                   // Activar overflow
                estado: typeof data.options.overflow.estado != "undefined" ? data.options.overflow.estado : false,            // Mostrar en true los elementos Pre/post
                items: typeof data.options.overflow.items != "undefined" ? data.options.overflow.items : 0,                 // Items para mostrar
                query: typeof data.options.overflow.query != "undefined" ? data.options.overflow.query : false,             // true|false => Desactivar si es true (combinar con window.MatchMeadia)
                container: typeof data.options.overflow.container != "undefined" ? data.options.overflow.container : false          // Contenedor de referencia para el slider   
            }
            :
            {                                                     // Activar overflow
                estado: false,                                    // Mostrar en true los elementos Pre/post
                items: 0,                                         // Items para mostrar
                query: false,                                     // true|false => Desactivar si es true (combinar con window.MatchMeadia)
                container: false                                  // Contenedor de referencia para el slider   
            }

        // Corrección Legacy data estructure
        this.options.overflow.estado = typeof data.overflow != "undefined" && typeof data.overflow.estado != "undefined" ? data.overflow.estado : this.options.overflow.estado
        this.options.overflow.items = typeof data.overflow != "undefined" && typeof data.overflow.items != "undefined" ? data.overflow.items : this.options.overflow.items
        this.options.overflow.query = typeof data.overflow != "undefined" && typeof data.overflow.query != "undefined" ? data.overflow.query : this.options.overflow.query
         
    }
    
    configModo ( data )
    {
        this.options.mode = data.options.mode != undefined ? data.options.mode : "default"
        if ( this.options.mode == "solo" )
        {
            this.configSolo( data );
        }
        if ( this.options.mode == "vue" )
        {
            this.configVue( data );
        }
    }
    configSolo ( data )
    {
        this.options.modeSolo = { // Funciones solo
            mini: data.options.modeSolo.mini != undefined ? data.options.modeSolo.mini : false // Mostrar miniaturas [true|false]:
        }
    }
    configVue ( data )
    {
        this.options.modeVue = { // Configuración Vue
            mini: data.options.modeVue.mini != undefined ? data.options.modeVue.mini : false // Mostrar miniaturas [true|false]:
        }
    }


    //#endregion Configs

    //#region Media Methods

    setMedia ()
    {
        return {
            desktop: !checkMobileSize() && !checkTabletSize(),
            tablet: checkTabletSize(),
            mobile: checkMobileSize()
        }
    }
    mediaChange ( k )
    {
        if (
            this.sliderList[ k ].media.desktop != ( !checkMobileSize() && !checkTabletSize() )    // Ha cambiado el desktop
            || this.sliderList[ k ].media.tablet != checkTabletSize()                           // Ha cambiado el Tablet
            || this.sliderList[ k ].media.mobile != checkMobileSize()                           // Ha cambiado el Mobile
        )
        {
            this.sliderList[ k ].media = this.setMedia()
            return true
        }
        return false
    }
    
    getShow(){
        if(checkMobileSize()){ return this.show.mobile; }
        else if(checkTabletSize()){ return this.show.tablet; }
        else { return this.show.default }
    }
    getTimeout(){
        if(checkMobileSize()){ return this.timeout.mobile; }
        else if(checkTabletSize()){ return this.timeout.tablet; }
        else { return this.timeout.default }
    }
    
    //#endregion Media Methods


    /* Llamando a la función sliderLoadAll() */
    /**
     * Para cada elemento de la lista, agregue un control deslizante y cárguelo.
     */
    sliderLoadAll ()
    {
        this.options.listadoItems.forEach( ( current, index ) =>
        {
            this.addSlider( current, index )
            this.sliderLoad( current, index )
        } )
        if ( !this.options.resizeCtrl )
        {
            this.options.resizeCtrl = true
            document.addEventListener( "resize", () =>
            {
                if ( this.mediaChange() )
                {
                    this.sldierRemoveAll( true )
                }
            }
            )
        }
        let sliderStyles = document.createElement( "style" )
        sliderStyles.innerHTML = `
        @-webkit-keyframes soloSlidePrev {
            from {
                margin-left: -100%;
            }
            to {
                margin-left: 0%;
            }
        }
        
        @keyframes soloSlidePrev {
            from {
                margin-left: -100%;
            }
            to {
                margin-left: 0%;
            }
        }
        .owSlider_slideBox .unselectable {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            overflow-x: hidden;
            align-items: center;
            justify-content: flex-start;
        }`
        document.head.append( sliderStyles )
    }

    addSlider(current, index){
        this.sliderList.push({id: index, current: current})
    }
    
    sliderLoad ( current, k )
    {

        this.sliderList[ k ].slideInfo = {
            //const slideInfo = {
            id: k,
            current: current,
            autoplay: this.options.autoplay.query ? false : this.options.autoplay.estado,   // Comprobamos si por mediaQuery se tiene que cargar el autoplay
            overFlow: this.options.overflow.query ? false : this.options.overflow.estado,  // Si el estado es True, guardamos el opuesto al mediaQuery       
        }

        this.sliderList[ k ].scrollEvent = {
            move: false,
            init: 0,
            end: 0,
            moving: null,
            maxScroll: 0
        }

        console.log( `sliderLoad` );
        // Check Mode
        this.modeVue( k )
        
    }

    //#region modeVue

    modeVue ( k )
    {
        console.log( `VueMode active` );
        // Get contenedor
        this.sliderList[ k ].slideInfo.contenedor = this.sliderList[ k ].slideInfo.current.firstChild;
        
        // Get Items
        this.sliderList[ k ].itemInfo = {
            list: this.sliderList[ k ].slideInfo.contenedor.querySelectorAll( this.itemsQuery ),
            width: 0,
            gap: 0,
            desplazamiento: 0
        }
        this.init = this.sliderList[ k ].itemInfo.list.length > this.init ? this.init : 0

        if ( this.sliderList[ k ].itemInfo.list.length > 1 )
        {
            // Creamos Vue-slider:
            let sliderBox = document.createElement( 'Vue-slide' )
            sliderBox.setAttribute( ':class', `['owSlider_slideBox']` )
            sliderBox.setAttribute( ':key', `'sliderBox'` )
            sliderBox.setAttribute( ':slide-init', this.init )
            sliderBox.setAttribute( ':slide-current', this.init )
            sliderBox.setAttribute( ':item-list', 'itemList' )
            sliderBox.setAttribute( ':show-items', 'numItems' )
            sliderBox.setAttribute( ':width', 'width' )
            sliderBox.setAttribute( 'ref', 'slider' )
            //sliderBox.setAttribute( 'v-on','{next:addItemNext, prev:addItemPrev}' )
            sliderBox.setAttribute( 'v-on:next', 'addItemNext()' )
            sliderBox.setAttribute( 'v-on:prev', 'addItemPrev()' )
            // this.sliderList[ k ].slideInfo.current.setAttribute('v-on:next', 'goToNext()')
            // this.sliderList[ k ].slideInfo.current.setAttribute('v-on:prev', 'goToPrev()')
            this.sliderList[ k ].slideInfo.current.prepend( sliderBox )
            

            if ( this.options.nav.arrows )
            {
                let arrowsBox = document.createElement( 'Vue-arrows' )
                arrowsBox.setAttribute( ':class', `['owsliders-nav','vuesliders-nav']` )

                
                // Agregamos flechas al contenedor de navegación
                // arrowsBox.appendChild( navegacion_prev );
                // arrowsBox.appendChild( navegacion_next );
                
                this.sliderList[ k ].slideInfo.current.append( arrowsBox )
            }
            // Listado
            let itemsList = this.sliderList[ k ].slideInfo.contenedor
            itemsList.setAttribute( ':key', `sliderList-${ k }` )
            itemsList.setAttribute( 'v-if', 'false' )

            // Get Prev and next item
            let next = this.init + 1 >= this.sliderList[ k ].itemInfo.list.length
                ? 0 : this.init + 1
            let prev = this.init - 1 < 0
                ? this.sliderList[ k ].itemInfo.list.length - 1
                : this.init - 1
            
            
            // Asignamos un ID al contenedor si no lo tiene
            this.sliderList[ k ].slideInfo.current.id = this.sliderList[ k ].slideInfo.current.id != ""
                ? this.sliderList[ k ].slideInfo.current.id
                : `sliderID${ k }v${ Math.round( Math.random() * 100000 ) }`
            
            //Objeto con la configuración del slider
            const SLIDERVUE_DATA = {
                itemList: this.sliderList[ k ].itemInfo.list,
                show: this.show,
                timeout: this.timeout,
                numItems: this.getShow(),
                init: this.init,
                current: this.init,
                next: next,
                prev: prev,
                currentSlide: this.sliderList[ k ].slideInfo.current.id

            }
            
            this.sliderList[ k ].vue = Vue.createApp( {
                data ()
                {
                    return {
                        itemList: SLIDERVUE_DATA.itemList,
                        show: SLIDERVUE_DATA.show,
                        timeout: SLIDERVUE_DATA.timeout,
                        numItems: SLIDERVUE_DATA.numItems,
                        slideCurrent: SLIDERVUE_DATA.current,
                        next: SLIDERVUE_DATA.next,
                        prev: SLIDERVUE_DATA.prev,
                        currentSlide: SLIDERVUE_DATA.currentSlide,
                        width: 0,
                        csStyle: ''
                    }
                },
                mounted ()
                {
                    this.width = document.querySelector( `#${ this.currentSlide } .owSlider_vue` ).getBoundingClientRect().width
                    this.cssStyle = `@-webkit-keyframes sliderPrev${ this.currentSlide } { from { margin-left: -${ this.width }px; } to { margin-left: 0px; } }
                    @keyframes sliderPrev${ this.currentSlide } { from { margin-left: -${ this.width }px; } to { margin-left: 0px; } }
                    @-webkit-keyframes sliderNext${ this.currentSlide } { from { margin-left: 0; } to { margin-left: -${ this.width }px; } }
                    @keyframes sliderNext${ this.currentSlide } { from { margin-left: 0px; } to { margin-left: -${ this.width }px; } }`
                    window.addEventListener( "resize", () =>
                    {
                        this.onResize()
                        this.width = document.querySelector( `#${ this.currentSlide } .owSlider_vue` ).getBoundingClientRect().width
                        this.cssStyle = `@-webkit-keyframes sliderPrev${ this.currentSlide } { from { margin-left: -${ this.width }px; } to { margin-left: 0px; } }
                        @keyframes sliderPrev${ this.currentSlide } { from { margin-left: -${ this.width }px; } to { margin-left: 0px; } }
                        @-webkit-keyframes sliderNext${ this.currentSlide } { from { margin-left: 0; } to { margin-left: -${ this.width }px; } }
                        @keyframes sliderNext${ this.currentSlide } { from { margin-left: 0px; } to { margin-left: -${ this.width }px; } }`
                    }  );
                },
                unmounted() {
                    window.removeEventListener("resize", this.onResize);
                },
                // created() {
                //     window.addEventListener("resize", this.onResize);
                // },
                // destroyed() {
                //     window.removeEventListener("resize", this.onResize);
                // },
                watch: {

                },
                computed: {

                },
                methods: {
                    onResize ()
                    {
                        if ( this.numItems != this.getShow() )
                        { this.numItems = this.getShow() }
                    },
                    getShow(){
                        if(checkMobileSize()){ return this.show.mobile; }
                        else if(checkTabletSize()){ return this.show.tablet; }
                        else { return this.show.default }
                    },
                    getTimeout(){
                        if(checkMobileSize()){ return this.timeout.mobile; }
                        else if(checkTabletSize()){ return this.timeout.tablet; }
                        else { return this.timeout.default }
                    },
                    addItemNext (  )
                    {
                        console.log(`addItemNext`);
                    },
                    addItemPrev (  )
                    {
                        console.log(`addItemPrev`);
                    },

                },
            } )
            
            this.sliderList[ k ].vue.component( 'VueSlide', {
                template: `<div><div class="owSlider_vue unselectable" v-html="currentContent" :style="animacion"></div><div style="display:none;" v-html="cssBase"></div></div>`,
                props: {
                    slideInit: {
                        type: Number,
                        default: 0
                    },
                    slideCurrent: {
                        type: Number,
                        default: 0
                    },
                    itemList: {
                        type: Object
                    },
                    showItems: {
                        type: Number,
                    },
                    width: {
                        type: Number,
                    }
                },
                style: this.cssBase,
                data() {
                    return {
                        currentContent: this.getInitial(),
                        currentItem: this.slideCurrent,
                        moving: false,
                        animacion: "",
                        cssBase: ``
                    }
                },
                mounted() {
                    this.cssBase = `<style>@-webkit-keyframes sliderPrev${ this.$root.currentSlide } { from { margin-left: -${ this.width }px; } to { margin-left: 0px; } }
                    @keyframes sliderPrev${ this.$root.currentSlide } { from { margin-left: -${ this.width }px; } to { margin-left: 0px; } }
                    @-webkit-keyframes sliderNext${ this.$root.currentSlide } { from { margin-left: 0; } to { margin-left: -${ this.width }px; } }
                    @keyframes sliderNext${ this.$root.currentSlide } { from { margin-left: 0px; } to { margin-left: -${ this.width }px; } }</style>`

                },
                watch: {
                    width ()
                    {
                        this.cssBase = `<style>@-webkit-keyframes sliderPrev${ this.$root.currentSlide } { from { margin-left: -${ this.width }px; } to { margin-left: 0px; } }
                        @keyframes sliderPrev${ this.$root.currentSlide } { from { margin-left: -${ this.width }px; } to { margin-left: 0px; } }
                        @-webkit-keyframes sliderNext${ this.$root.currentSlide } { from { margin-left: 0; } to { margin-left: -${ this.width }px; } }
                        @keyframes sliderNext${ this.$root.currentSlide } { from { margin-left: 0px; } to { margin-left: -${ this.width }px; } }</style>`
                    }
                },
                methods:
                {
                    getInitial ()
                    {
                        let max = this.showItems;
                        let itemId = this.slideInit - 1
                        let initial = ''
                        
                        for ( let i = 0; i < max; i++ )
                        {
                            itemId = itemId + 1 >= this.itemList.length ? 0 : itemId + 1
                            
                            initial += this.itemList[itemId].outerHTML
                            
                        }
                        return initial
                    },
                    setCurrent ()
                    {
                        let max = this.showItems;
                        let itemId = this.currentItem
                        let initial = ''
                        
                        for ( let i = 0; i < max; i++ )
                        {                            
                            initial += this.itemList[ itemId ].outerHTML
                            itemId = itemId + 1 >= this.itemList.length ? 0 : itemId + 1   
                        }
                        return initial
                    },
                    addItemNext ( )
                    {
                        console.log( `addItemNext` );
                        if ( !this.moving )
                        {
                            this.moving = true;
                            let next = this.$parent.next + this.$parent.getShow() - 1 >= this.itemList.length
                                ? this.$parent.next + this.$parent.getShow() - 1 - this.itemList.length
                                : this.$parent.next + this.$parent.getShow() - 1 ;
                            this.currentContent += this.itemList[ next ].outerHTML
                            this.currentItem = this.currentItem + 1 >= this.itemList.length
                                ? 0
                                :  this.currentItem + 1
                            this.updatePrevNext()
                            //this.animacion = `transition: all ${this.$root.getTimeout() / 1000}s ease-in-out; margin-left: ${this.$root.width * ( -1 )}px;`
                            this.animacion = `animation-name: sliderNext${ this.$root.currentSlide }; animation-duration: ${ this.$root.getTimeout() / 1000 }s; animation-fill-mode: forwards;`
                            //this.animacion = `transition: all ${this.$root.getTimeout() / 1000}s ease-in-out; transform: translateX( -${this.$root.width}px);`
                            setTimeout( () =>
                            {
                                this.animacion = ``
                                // this.currentContent = this.itemList[ this.currentItem ].outerHTML
                                this.currentContent = this.setCurrent()
                                this.moving = false;
                            }, this.$root.getTimeout() )
                        }

                    },
                    addItemPrev ()
                    {
                        console.log( `addItemPrev` );
                        if ( !this.moving )
                        {
                            this.moving = true;
                            let prev = this.$parent.prev
                            console.log(`prev ${prev}`);
                            this.currentContent = this.itemList[ prev ].outerHTML + this.currentContent
                            //this.currentItem = this.$parent.prev
                            this.currentItem = this.currentItem - 1 < 0
                                ? this.itemList.length - 1
                                :  this.currentItem - 1
                            this.updatePrevNext()
                        
                            this.animacion = `animation-name: sliderPrev${ this.$root.currentSlide }; animation-duration: ${ this.$root.getTimeout() / 1000 }s; animation-fill-mode: forwards;`
                            setTimeout( () =>
                            {
                                this.animacion = ``
                                // this.currentContent = this.itemList[ this.currentItem ].outerHTML
                                this.currentContent = this.setCurrent()
                                this.moving = false;
                            }, this.$root.getTimeout() )
                        }
                        
                    },
                    updatePrevNext ()
                    {                        
                        this.$parent.next = this.currentItem + 1 >= this.itemList.length ? 0 : this.currentItem + 1
                        this.$parent.prev = this.currentItem - 1 < 0 ? this.itemList.length - 1 : this.currentItem - 1
                        console.log( `Update this.$parent.next: ${ this.$parent.next }` );
                        console.log( `Update this.$parent.prev: ${ this.$parent.prev }` );
                        
                    }

                },
                emits:['next','prev'],
                
                
            } )
            
            this.sliderList[ k ].vue.component( 'VueArrows', {
                template: `<div>
                        <span
                            ref="'prevButton'"
                            @click="goPrev"
                            :class="['icon-nav', 'nav_prev']"
                            >‹
                        </span>
                        <span
                            ref="'nextButton'"
                            @click="goNext"
                            :class="['icon-nav', 'nav_next']" 
                            >›
                        </span>
                        </div>`,
                data() {
                    return {
                        
                    }
                },
                methods: {
                    goNext ()
                    {
                        console.log('next');
                        this.$root.$refs.slider.addItemNext()
                        return true;
                    },
                    goPrev ()
                    {
                        console.log('prev');
                        this.$root.$refs.slider.addItemPrev()
                        return true;
                    }
                },
                emits:['next','prev','click'],
            } )
            
            this.sliderList[ k ].vue.mount( `#${this.sliderList[ k ].slideInfo.current.id}` );
        }
    }

    setListKeys ( k )
    {
        this.sliderList[ k ].itemInfo.list.forEach( ( item, idx ) =>
        {
            item.setAttribute( ':key', `item-${ idx }` );
            item.setAttribute( ':idx', idx );
        })
    }
    //#endregion modeVue


}
