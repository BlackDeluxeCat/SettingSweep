var all = new Seq();
var ulk = new Seq();
var req = new Seq();
var highscore = new Seq();//High Score of Maps
var save = new Seq();//campaign
var other = new Seq();

var current;

var catT = new Table();
var listT = new Table();
var valueT = new Table();

var cont;

var regex;
var regtext = "";

Events.on(ClientLoadEvent, e => {
    buildCatT();

    Vars.ui.settings.addCategory("Setting Sweep", new TextureRegionDrawable(new TextureRegion(Vars.mods.getMod("settingsweep").iconTexture)), t => {
        t.clear();
        cont = t;
    });

    Vars.ui.settings.shown(() => {
        updateKeys();
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

    cont.table(cons(ttt => {
        ttt.image().size(36).update(i => {
            i.setColor(regex == null && !regtext.length == 0 ? Color.scarlet : Color.forest);
        });
        var regf = ttt.field("", str => {
            regtext = str;
            regex = null;
            try{
                if(str.length > 0) regex = java.util.regex.Pattern.compile(str);
            }catch(e){
                Log.err(e);
                regex = null;
            }
            buildListT(null);
        }).growX().get();
        regf.setMessageText("Regular expression filter");
        ttt.button("[X]", Styles.flatt, () => {regf.clearText(); regf.change();}).size(36);
        ttt.button("[scarlet]Delete All", Styles.flatt, () => Vars.ui.showConfirm(regex == null ? "Delete All In List?" : "Delete These Keys Matching: " + regex.pattern() + "?", () => {
            removeByRegex();
        })).size(100, 36).disabled(b => current == null || current.isEmpty());
    })).growX();
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

    catT.row();

    catT.label(() => all.size.toString()).get().setAlignment(Align.center);
    catT.label(() => other.size.toString()).get().setAlignment(Align.center);
    catT.label(() => highscore.size.toString()).get().setAlignment(Align.center);
    catT.label(() => save.size.toString()).get().setAlignment(Align.center);
    catT.label(() => req.size.toString()).get().setAlignment(Align.center);
    catT.label(() => ulk.size.toString()).get().setAlignment(Align.center);
}

function buildValueT(name, object){
    valueT.clear();
    valueT.add(name + ":").color(Color.gray).growX();
    valueT.button("[scarlet]Delete", Styles.flatt, () => Vars.ui.showConfirm("Delete Key: " + name + " ?", () => {
        Core.settings.remove(name);
    })).size(100, 36).disabled(b => !Core.settings.has(name));
    valueT.row();
    valueT.labelWrap(object == null ? "null" : object.toString()).growX().colspan(2);
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

function buildListT(seq){
    updateKeys();
    if(seq != null) current = seq;

    listT.clear();
    if(current == null) return;

    current.each(name => {
        if(regex != null && !regex.matcher(name).matches()) return;
        listT.button(name, Styles.flatt, () => {
            buildValueT(name, Core.settings.get(name, ""));
        }).grow().maxHeight(36).disabled(b => !Core.settings.has(name)).with(l => l.getLabel().setAlignment(Align.left));
        listT.row();
    });
}

function removeByRegex(){
    current.each(name => {
        if(regex != null && !regex.matcher(name).matches()) return;
        Core.settings.remove(name);
    });
}