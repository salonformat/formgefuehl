import { decodeCell } from './pattern.js';
const pairs = [
 ['Wiener Werkstätte.','Wiener Werkstätte.'],['Kunst für den Alltag.','Art for everyday life.'],
 ['In Wien entstand 1903 eine Gemeinschaft von Künstler:innen und Handwerker:innen. Sie gestalteten Möbel, Stoffe, Geschirr und ganze Räume. Alles sollte zusammenpassen – bis ins kleinste Detail.','In Vienna in 1903, artists and craftspeople came together. They designed furniture, fabrics, tableware and entire rooms. Everything could belong together, down to the smallest detail.'],
 ['Wähle Form und Farbe.','Pick a shape and a colour.'],['Tippe oder zeichne in die Kästchen.','Tap or draw across the squares.'],['Form wählen','Choose a shape'],['Farbe wählen','Choose a colour'],['Quadrat','Square'],['Kreis','Circle'],['Bogen','Arc'],['Dreieck','Triangle'],['Tintenschwarz','Ink black'],['Drehen','Rotate'],['Radieren','Erase'],
 ['Formgefühl','A Feel for Form'],['Formgefühl.','A Feel for Form.'],['Form','A feel'],['gefühl.','for form.'],
 ['Frauen prägten die Werkstätte entscheidend mit. Mathilde Flögl und Felice Rix-Ueno entwarfen unter anderem Stoffmuster; Vally Wieselthier wurde besonders für ihre Keramik bekannt.','Women helped shape the workshop. Mathilde Flögl and Felice Rix-Ueno designed fabrics among many other things; Vally Wieselthier became especially known for her ceramics.'],
 ['Die Frauen dahinter.','The women behind it.'],['Viele Frauen gaben der Wiener Werkstätte ihre Vielfalt. Ihre Namen waren lange weniger bekannt. Drei davon solltest du kennenlernen.','Many women shaped the rich variety of the Wiener Werkstätte. For a long time, their names were less well known. Here are three worth getting to know.'],['Gestalterinnen entdecken','Meet the women designers'],
 ['Mathilde Flögl gestaltete Stoffe, Tapeten, Keramik, Taschen und vieles mehr. Ihre Arbeit zeigt, wie offen die Grenzen zwischen den einzelnen Bereichen waren.','Mathilde Flögl designed fabrics, wallpaper, ceramics, bags and much more. Her work moved freely between different kinds of design.'],
 ['Felice Rix-Ueno entwarf fantasievolle Muster für Stoffe und Tapeten. Ihre Arbeit erinnert daran: Zur Wiener Werkstätte gehören auch lebendige Farben und freie Formen.','Felice Rix-Ueno created imaginative patterns for fabrics and wallpaper. Her work shows another side of the Wiener Werkstätte: lively colours and free-flowing shapes.'],
 ['Vally Wieselthier machte aus Keramik ausdrucksstarke Figuren und Gefäße. An ihrer Arbeit sieht man, wie eng Form, Farbe und Material zusammenwirken.','Vally Wieselthier made expressive ceramic figures and vessels. Her work brings shape, colour and material together.'],
 ['Mehr über die Frauen der Wiener Werkstätte','More about the women of the Wiener Werkstätte'],
 ['Jetzt liegt dein Muster in Falten. Stoffentwürfe von Frauen wie Felice Rix-Ueno und Mathilde Flögl prägten die Wiener Werkstätte.','Now your pattern falls into folds. Fabric designs by women such as Felice Rix-Ueno and Mathilde Flögl helped shape the Wiener Werkstätte.'],
 ['Entdecke die Wiener Werkstätte.','Discover the Wiener Werkstätte.'],['Gestalte dein eigenes Muster.','Make a pattern of your own.'],['Vom ersten Kästchen bis zum ganzen Raum.','From one little square to a whole room.'],['Eine Experience von','An experience by'],['Salon Format.','Salon Format.'],
 ['Was war die Wiener Werkstätte?','What was the Wiener Werkstätte?'],
 ['Eine Gemeinschaft von Gestalter:innen und Handwerker:innen in Wien. Josef Hoffmann, Koloman Moser und Fritz Waerndorfer gründeten sie 1903.','A group of designers and craftspeople in Vienna, founded in 1903 by Josef Hoffmann, Koloman Moser and Fritz Waerndorfer.'],
 ['Sie entwarfen Möbel, Geschirr, Schmuck und Stoffe. Ihr Wunsch: Dinge des Alltags mit derselben Sorgfalt gestalten wie ein Kunstwerk.','They designed furniture, tableware, jewellery and fabrics. Their idea: give everyday things the same care as a work of art.'],
 ['Die Wiener Werkstätte bestand bis 1932. Klare geometrische Muster gehörten dazu – aber auch Blumen, geschwungene Linien und verspielte Formen.','The Wiener Werkstätte lasted until 1932. Its designs included bold geometric patterns, but also flowers, flowing lines and playful shapes.'],
 ['Dein Muster','Your pattern'],['wird zum Raum.','becomes a room.'],['Alles hängt','It all fits'],['zusammen.','together.'],['Ein kleines Muster.','One little pattern.'],['Ein ganz anderer Raum.','A different kind of room.'],
 ['Für die Wiener Werkstätte hörte Gestaltung nicht beim einzelnen Gegenstand auf. Ein Stuhl, der Stoff darauf, die Tapete dahinter: All das konnte zusammen entworfen werden.','For the Wiener Werkstätte, design did not stop at a single object. A chair, its fabric, the wallpaper behind it: all of these could be designed together.'],
 ['Dahinter steht die Idee des','This is the idea of the'],['Gesamtkunstwerks.','Gesamtkunstwerk.'],['Verschiedene Dinge werden zu einem stimmigen Ganzen.','A total work of art: different things coming together as a whole.'],
 ['Wie viel in einem kleinen Detail stecken kann.','So much can start with one small detail.'],['Darum diese kleine Liebeserklärung.','That is what this little love letter is about.'],
 ['Ein Muster für Papier oder Tapete. Die Wiener Werkstätte gestaltete beides.','A pattern for paper or wallpaper. The Wiener Werkstätte designed both.'],
 ['Jetzt liegt dein Muster in Falten. Die Wiener Werkstätte entwarf auch Stoffe – für Kleidung und Räume.','Now your pattern falls into folds. The Wiener Werkstätte also designed fabrics, for clothes and interiors.'],
 ['Jetzt fällt Licht auf Metall. Auch Metallarbeiten gehörten zur Wiener Werkstätte, vom Schmuck bis zum Gebrauchsgegenstand.','Now your pattern catches the light. The Wiener Werkstätte also worked in metal, making jewellery and everyday objects.'],
 ['Mein Muster gestalten','Make my own pattern'],['Dieses Muster selbst gestalten','Make this pattern your own'],['Dieses Muster wartet auf dich','This pattern is waiting for you'],
 ['Tippe ein Kästchen an.','Tap a little square.'],['Dein Muster verändert sich sofort.','Watch your pattern change.'],['Hier tippen','Try this one'],['Schwarz. Farbe. Weg.','Black. Colour. Clear.'],['Jeder Klick verändert dein Kästchen.','Each tap changes your square.'],['Dein Zeichen wiederholt sich im Muster.','Your mark repeats across the pattern.'],
 ['Ein Muster bleibt.','A pattern stays.'],
 ['Ein Muster','A pattern'],['bleibt.','stays.'],
 ['Aus einem kleinen Zeichen','One little mark.'],['kann eine ganze Welt werden.','A whole world waiting.'],
 ['Probier es aus','Give it a go'],['Eine kleine Reise. Dein eigener Entwurf.','A little adventure. A design of your own.'],
 ['Eine kleine Liebeserklärung','A little love letter'],['an die Wiener Werkstätte.','to the Wiener Werkstätte.'],
 ['Von dir gestaltet.','Made by you.'],['Von Salon Format erdacht.','Dreamed up by Salon Format.'],
 ['Alle Projekte','All projects'],['Salon Format – zur Website','Salon Format – visit the website'],
 ['Bewegung reduzieren','Reduce motion'],['Bewegung reduziert','Motion reduced'],['Ton aus','Sound off'],['Ton an','Sound on'],['Ton nicht verfügbar','Sound unavailable'],
 ['Zurück','Back'],['Klein anfangen.','Start small.'],['Tippe auf die Felder.','Tap the squares.'],['Ein zweites Mal bringt Farbe ins Spiel.','Tap again to add a little colour.'],
 ['Dein Zeichen, 5 mal 5 Felder','Your mark, a grid of 5 by 5 squares'],['Akzentfarbe','Accent colour'],['Zinnoberrot','Vermilion'],['Messinggelb','Brass yellow'],['Rauchblau','Smoky blue'],
 ['Leeren','Clear'],['Rückgängig','Undo'],['Ein Zeichen wird zum','One mark becomes a'],['Rapport','repeat'],['– der Einheit, die sich wiederholt. Aus solchen Wiederholungen entstehen zum Beispiel Stoff- und Tapetenmuster.','– a little design that appears again and again. That is how a pattern grows, on fabric or wallpaper.'],
 ['Das Muster betreten','Step inside'],['Setze zuerst mindestens ein Zeichen.','Add at least one mark first.'],['Dein Zeichen verändert das Ganze.','One small change. A whole new pattern.'],
 ['Zeichen verändern','Change your mark'],['Ein Entwurf.','One design.'],['Viele Leben.','Many lives.'],['Bewege den Zeiger. Schau dich um.','Move your pointer. Look around.'],['Ziehe über den Raum. Schau dich um.','Drag across the room. Look around.'],
 ['Dein Browser zeigt eine flächige Ansicht. Material und Maßstab kannst du trotzdem erkunden.','Your browser is showing a flat view. You can still play with materials and size.'],
 ['Material erleben','Explore materials'],['Papier','Paper'],['Textil','Fabric'],['Metall','Metal'],
 ['Auf Papier wird dein Zeichen zur Fläche. Wie verändert es den Raum?','On paper, your mark becomes a pattern. What does it do to the room?'],
 ['Die Form bleibt. Das Gewebe macht sie weich. Muster werden zu etwas, das uns umgibt und berührt.','The same mark, woven into cloth. Softer now. Something you can almost feel.'],
 ['Die Form bleibt. Das Licht verändert sich. Glanz und Schatten geben dem Muster eine neue Wirkung.','The same mark, a different light. In metal, it catches the glow and casts a shadow.'],
 ['Maßstab','Size'],['Klein ↔ groß','Small ↔ large'],['Mittleres Muster','Medium pattern'],['Kleines, dichtes Muster','Small, close pattern'],['Großes, weites Muster','Large, open pattern'],
 ['Was steckt dahinter?','What is the idea?'],['Vom Detail','From one detail'],['zur ganzen Welt.','to a whole world.'],
 ['Du hast ein Zeichen entworfen.','You made a little mark.'],['Und damit einen Raum verändert.','And changed a whole room.'],
 ['Ein Gedanke der Wiener Werkstätte: Alltägliche Dinge und die Räume um sie herum gemeinsam gestalten. Ein Buch, ein Stoff, ein Möbelstück – jedes Detail zählt. Grafik, Handwerk und Architektur begegnen sich.','The Wiener Werkstätte imagined everyday things and their surroundings together. A book, a fabric, a chair: every detail matters. Art, craft and architecture meet.'],
 ['Diese Idee heißt','There is a word for this:'],['Gesamtkunstwerk.','Gesamtkunstwerk.'],['Dein Muster hat sie gerade erfahrbar gemacht.','A total work of art. You just tried a little piece of that idea.'],
 ['Was hat deinen Raum stärker verändert?','What changed your room the most?'],['Der Maßstab','The size'],['Das Material','The material'],
 ['Ein kleines Muster wird als Rhythmus wahrgenommen. Ein großes kann selbst zur Architektur werden. Du hast dieselbe Form anders erlebt.','Small shapes create a rhythm. Make them bigger, and they start to shape the room itself. Same mark, different feeling.'],
 ['Papier, Gewebe, Metall: Das Material verändert Licht und Oberfläche. Eine Form hat deshalb nie nur eine einzige Wirkung.','Paper, cloth, metal: each catches light in its own way. The same shape can feel completely different.'],
 ['Dein Muster mitnehmen','Keep your pattern'],['Noch einmal spielen','Play again'],['Die Geschichte dahinter','A little backstory'],
 ['1903 gründeten Josef Hoffmann, Koloman Moser und Fritz Waerndorfer die Wiener Werkstätte. Kunst und Handwerk sollten den Alltag prägen. Geometrie war eine ihrer Ausdrucksformen – neben vielen anderen.','In 1903, Josef Hoffmann, Koloman Moser and Fritz Waerndorfer founded the Wiener Werkstätte in Vienna. They brought art and craft into everyday life. Geometric shapes were one part of a much wider world of design.'],
 ['Entwerfen bedeutete hier auch: über Material und Ausführung nachdenken. Dieselbe Idee kann als Druck, Gewebe oder Metallarbeit eine andere Wirkung entfalten. Genau das hast du gerade ausprobiert.','Design also meant thinking about materials and how things are made. An idea could live as a print, a woven fabric or a metal object. Each feels different. That is what you just explored.'],
 ['Dein Entwurf ist eine heutige, freie Interpretation. Er bildet kein historisches Muster und keinen historischen Raum nach.','Your design is a new, playful interpretation. It does not recreate a historical pattern or room.'],
 ['Weiterentdecken: Wien 1900 im MAK','Explore more: Vienna 1900 at the MAK'],['Über das Wiener-Werkstätte-Archiv','About the Wiener Werkstätte archive'],
 ['Für die Liebe zum Detail.','For the love of little things.'],['Und die Freude daran, genauer hinzusehen.','And the joy of looking a little closer.'],
 ['Ein unabhängiges Vermittlungsprojekt von Salon Format. Kein Auftrag und keine Kooperation mit dem MAK. Alle Muster und Räume wurden für diese Experience neu gestaltet.','An independent learning experience by Salon Format. Not commissioned by or affiliated with the MAK. All patterns and spaces were created for this project.'],
 ['Deine Reise','Your journey'],['Anfang','Begin'],['Zeichen','Mark'],['Raum','Room'],['Gedanke','Idea'],['Über diese Erfahrung','About this experience'],['Schließen','Close'],
 ['Eine kleine Liebeserklärung von Salon Format an die Wiener Werkstätte: an das genaue Hinsehen, an die Verbindung von Kunst und Handwerk, an die Sorgfalt selbst im kleinsten Detail.','A little love letter from Salon Format to the Wiener Werkstätte: to looking closely, bringing art and craft together, and caring about even the smallest detail.'],
 ['Du gestaltest ein eigenes Zeichen, erkundest Wiederholung, Maßstab und Material – und erlebst die Idee des Gesamtkunstwerks.','Make your own mark. Play with repetition, size and materials. Discover how small things can belong to a bigger idea.'],
 ['Alle Muster, Raumkompositionen und Klänge sind für dieses Projekt neu entstanden. Es werden keine Bilder, Scans oder Logos des MAK verwendet. Es besteht keine Kooperation mit dem Museum.','All patterns, spaces and sounds were made for this project. No MAK images, scans or logos are used. This is an independent project, with no museum partnership.'],
 ['Mehr von Salon Format','More from Salon Format'],['Ohne Anmeldung. Ohne Tracking. Dein Entwurf bleibt während der Sitzung in deinem Browser.','No sign-up. No tracking. Your design stays in your browser during this visit.'],
 ['Dein Zeichen ist leer.','Your canvas is clear.'],['Das Bild konnte nicht gespeichert werden. Bitte versuche es erneut.','We could not save the image. Please try again.'],['Dein Muster ist als Druckdatei bereit.','Your pattern is ready to keep.'],
 ['DEIN ENTWURF · SALON FORMAT','YOUR DESIGN · SALON FORMAT'],['Aus einem Zeichen wird eine Welt.','One little mark. A whole new world.'],['Eine freie Auseinandersetzung mit der Wiener Werkstätte.','A playful exploration of the Wiener Werkstätte.'],
];
const deToEn = new Map(pairs), enToDe = new Map(pairs.map(([de,en])=>[en,de]));
let language = 'de';
const sourceTexts = new WeakMap();
const sourceAttributes = new WeakMap();
export function getLanguage(){return language;}
export function setLanguage(value){language=value==='en'?'en':'de';}
export function t(value){return language==='en'?(deToEn.get(value)||value):(enToDe.get(value)||value);}
export function translateDOM(root=document.body){
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  for(const node of nodes){
    if(node.parentElement?.closest('script,style'))continue;
    const raw=node.nodeValue,clean=raw.trim();let record=sourceTexts.get(node);
    if(!record||record.last!==clean)record={source:deToEn.has(clean)?clean:(enToDe.get(clean)||clean),last:clean};
    const translated=language==='en'?(deToEn.get(record.source)||record.source):record.source;
    if(translated!==clean)node.nodeValue=raw.replace(clean,translated);
    record.last=translated;sourceTexts.set(node,record);
  }
  for(const element of root.querySelectorAll('[aria-label],[aria-valuetext]')){
    const records=sourceAttributes.get(element)||{};
    for(const attr of ['aria-label','aria-valuetext']){
      const value=element.getAttribute(attr);if(!value)continue;
      let record=records[attr];if(!record||record.last!==value)record={source:deToEn.has(value)?value:(enToDe.get(value)||value)};
      const translated=language==='en'?(deToEn.get(record.source)||record.source):record.source;
      element.setAttribute(attr,translated);record.last=translated;records[attr]=record;
    }
    sourceAttributes.set(element,records);
  }
  document.documentElement.lang=language;
  document.title=language==='en'?'A Feel for Form — Salon Format':'Formgefühl — Salon Format';
  document.querySelector('meta[name="description"]').content=language==='en'?'One mark. One pattern. A whole world. A playful journey into the Wiener Werkstätte by Salon Format.':'Ein Zeichen. Ein Muster. Eine ganze Welt. Eine spielerische Reise zur Wiener Werkstätte von Salon Format.';
}
export function cellLabel(i,value){const v=decodeCell(value);const de=value?`${['Quadrat','Kreis','Bogen','Dreieck'][v.shape]}, ${['schwarz','rot','gelb','blau'][v.color]}`:'leer';const en=value?`${['square','circle','arc','triangle'][v.shape]}, ${['black','red','yellow','blue'][v.color]}`:'empty';return language==='en'?`Row ${Math.floor(i/5)+1}, column ${i%5+1}: ${en}. Click to draw.`:`Zeile ${Math.floor(i/5)+1}, Spalte ${i%5+1}: ${de}. Klicken zum Zeichnen.`;}
