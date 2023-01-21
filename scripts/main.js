var all = new Seq();
var ulk = new Seq();
var req = new Seq();
var highscore = new Seq();//High Score of Maps
var save = new Seq();//campaign
var other = new Seq();

var catT = new Table();
var listT = new Table();
var valueT = new Table();

var cont;

Events.on(ClientLoadEvent, e => {
    buildCatT();

    Vars.ui.settings.addCategory("Setting Sweep", new TextureRegionDrawable(new TextureRegion(Vars.mods.getMod("settingsweep").iconTexture)), t => {
        t.clear();
        cont = t;
    });

    Vars.ui.settings.shown(() => {
        rebuild();
    });
});


function rebuild(){
    cont.clear();
    cont.add("You Should Make Sure You Know What You're Doing \nBefore Deleting[white](X)[] Any Of The Settings!").color(Color.scarlet);
    cont.row();
    cont.image().growX().height(4).color(Color.forest);
    cont.row();
    cont.add(catT).growX();
    cont.row();
    cont.image().growX().height(4).color(Color.forest);
    cont.row();
    cont.pane(listT).growX().maxHeight(600);
    cont.row();
    cont.image().growX().height(4).color(Color.forest);
    cont.row();
    cont.pane(valueT).growX().maxHeight(300).margin(15).center();
}

function buildCatT(){
    catT.clear();
    catT.defaults().minHeight(36).width(100);
    catT.button("All", Styles.flatt, () => buildListT(all));
    catT.button("Other", Styles.flatt, () => buildListT(other));
    catT.button("High Score", Styles.flatt, () => buildListT(highscore));
    catT.button("Save", Styles.flatt, () => buildListT(save));
    catT.button("Campaign Req", Styles.flatt, () => buildListT(req));
    catT.button("Campaign Unlocked", Styles.flatt, () => buildListT(ulk));
}

function buildListT(seq){
    updateKeys();

    listT.clear();
    seq.each(name => {
        listT.button(name, Styles.flatt, () => {
            buildValueT(name, Core.settings.get(name, ""));
        }).grow().maxHeight(36).disabled(b => !Core.settings.has(name)).with(l => l.getLabel().setAlignment(Align.left));
        listT.button("X", Styles.flatt, () => Vars.ui.showConfirm("Delete Key: " + name + " ?", () => {
            Core.settings.remove(name);
        })).size(36).disabled(b => !Core.settings.has(name));
        listT.row();
    });
}

function buildValueT(name, object){
    valueT.clear();
    valueT.add(name + ":").color(Color.gray).growX();
    valueT.row();
    valueT.labelWrap(object == null ? "null" : object.toString()).growX();
}

function updateKeys(){
    all.clear();
    ulk.clear();
    req.clear();
    save.clear();
    highscore.clear();
    other.clear();
    let ite = Core.settings.keys().iterator();

    while(ite.hasNext()){
        all.add(ite.next());
    }

    all.sort();

    all.each(name => {
        if(name.startsWith("req-")) req.add(name);
        else if(name.endsWith("-unlocked")) ulk.add(name);
        else if(name.startsWith("save-")) save.add(name);
        else if(name.startsWith("hiscore")) highscore.add(name);
        else other.add(name);
    });
}