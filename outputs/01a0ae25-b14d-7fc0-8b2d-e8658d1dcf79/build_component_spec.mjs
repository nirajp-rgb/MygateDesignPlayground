import fs from 'node:fs/promises';
import path from 'node:path';
import { SpreadsheetFile, Workbook } from '@oai/artifact-tool';

const repoRoot = '/Users/niraj/Documents/GitHub/MygateDesignPlayground';
const outputDir = path.join(repoRoot, 'outputs/01a0ae25-b14d-7fc0-8b2d-e8658d1dcf79');
const outputPath = path.join(outputDir, 'component-spec-sheet.xlsx');
const fontFamily = 'Arial';

const components = [
  ['AppHeader','Navigation','src/components/AppHeader.tsx','AppHeaderProps','Configurable top app bar with navigation, title, slots, and actions.','Navigation','Active','Yes'],
  ['AppBottomNav','Navigation','src/components/AppBottomNav.tsx','AppBottomNavProps','Primary bottom navigation across app destinations.','Navigation','Active','Partial'],
  ['Avatar','Data display','src/components/Avatar.tsx','AvatarProps','Person identity marker using an image, initials, or fallback icon.','DataDisplay','Active','Yes'],
  ['Button','Actions','src/components/Button.tsx','ButtonProps','Labeled action trigger with semantic kinds, sizes, and states.','Actions','Active','Yes'],
  ['CategoryStatTile','Patterns','src/components/CategoryStatTile.tsx','CategoryStatTileProps','Feature tile pairing a category icon and label with a compact statistic.','ProductPatterns','Active','No'],
  ['Checkbox','Forms','src/components/Checkbox.tsx','CheckboxProps','Independent boolean or indeterminate selection control.','FormInputs','Active','Yes'],
  ['Chip','Forms','src/components/Chip.tsx','ChipProps','Compact assist, filter, or input action with optional icons.','Chips','Active','Yes'],
  ['IconButton','Actions','src/components/IconButton.tsx','IconButtonProps','Icon-only action trigger.','Actions','Active','Yes'],
  ['IconTile','Data display','src/components/IconTile.tsx','IconTileProps','Decorative icon container used inside richer components.','DataDisplay','Active','No'],
  ['IconPlaceholder','Internal','src/components/IconPlaceholder.tsx','IconPlaceholderProps','Development fallback used when an icon slot is empty.','','Internal','No'],
  ['ListItem','Data display','src/components/ListItem.tsx','ListItemProps','Structured list row with optional artwork, supporting text, trailing content, and navigation.','DataDisplay','Active','Yes'],
  ['ListingCard','Patterns','src/components/ListingCard.tsx','ListingCardProps','Marketplace-style listing summary with image, location, and price details.','ProductPatterns','Active','No'],
  ['NumberBadge','Data display','src/components/NumberBadge.tsx','NumberBadgeProps','Compact numeric notification badge capped visually at 99+.','DataDisplay','Active','No'],
  ['Radio','Forms','src/components/Radio.tsx','RadioProps','Single-choice selection control.','FormInputs','Active','Yes'],
  ['ScreenFrame','Internal','src/components/ScreenFrame.tsx','ScreenFrameProps','Prototype-only frame with descriptive header and screen switcher.','','Internal','No'],
  ['SectionHeader','Layout','src/components/SectionHeader.tsx','SectionHeaderProps','Section title row with optional subtitle, icon, action, and press behavior.','LayoutAndFeedback','Active','No'],
  ['Switch','Forms','src/components/Switch.tsx','SwitchProps','On/off setting control with optional label and description.','FormInputs','Active','Yes'],
  ['SurfaceCard','Layout','src/components/SurfaceCard.tsx','SurfaceCardProps','Generic contained surface for grouping child content.','LayoutAndFeedback','Active','No'],
  ['Tag','Data display','src/components/Tag.tsx','TagProps','Compact semantic label with optional interaction affordance.','DataDisplay','Active','No'],
  ['ReviewCard','Patterns','src/components/ReviewCard.tsx','ReviewCardProps','Compact review summary with rating, text, date, and badge slot.','ProductPatterns','Active','Yes'],
  ['Tile','Data display','src/components/Tile.tsx','TileProps','Selectable or actionable tile with artwork, labels, badges, and trailing content.','Tiles','Active','Yes'],
  ['TileGrid','Layout','src/components/TileGrid.tsx','TileGridProps','Fixed-column layout that arranges Tile items into aligned rows.','Tiles','Active','Yes'],
  ['UpdateCard','Feedback','src/components/UpdateCard.tsx','UpdateCardProps','Compatibility alias that maps legacy update-card content to Banner.','','Deprecated','No'],
  ['TextField','Forms','src/components/forms/TextField.tsx','TextFieldProps','Controlled text entry with labels, adornments, formatting hooks, and validation messaging.','FormInputs','Active','Yes'],
  ['SearchField','Forms','src/components/forms/SearchField.tsx','SearchFieldProps','Search input or search-launch trigger.','SearchTrigger','Active','Yes'],
  ['ChipGroup','Forms','src/components/forms/ChipGroup.tsx','ChipGroupProps','Controlled single- or multi-select collection of chips.','Chips','Active','Yes'],
  ['TileGroup','Data display','src/components/data-display/TileGroup.tsx','TileGroupProps','Controlled single- or multi-select collection of tiles.','Tiles','Active','Yes'],
  ['ListGroup','Layout','src/components/layout/ListGroup.tsx','ListGroupProps','Grouped ListItem collection that manages internal dividers.','LayoutAndFeedback','Active','Yes'],
  ['ActionFooter','Layout','src/components/layout/ActionFooter.tsx','ActionFooterProps','Bottom action area with a primary and optional secondary action.','OverlaysAndFooter','Active','Yes'],
  ['Banner','Feedback','src/components/feedback/Banner.tsx','BannerProps','Status or informational message with optional icon, action, and container press.','LayoutAndFeedback','Active','Yes'],
  ['ProgressSteps','Feedback','src/components/feedback/ProgressSteps.tsx','ProgressStepsProps','Segmented progress indicator with an optional current-step label.','LayoutAndFeedback','Active','Yes'],
  ['ModalSheet','Overlays','src/components/overlays/ModalSheet.tsx','ModalSheetProps','Modal content surface supporting page, full-screen, top, and bottom presentations.','OverlaysAndFooter','Active','Yes'],
  ['PressableSurface','Actions','src/components/actions/PressableSurface.tsx','PressableProps','Unstyled interaction primitive for approved patterns not covered by higher-level controls.','','Primitive','Inherited'],
  ['ModalSurface','Overlays','src/components/overlays/ModalSurface.tsx','ModalProps','Compatibility primitive for specialized native modal behavior.','','Primitive','Inherited'],
].map(([name,category,source,propsType, purpose, story, lifecycle, propsExport]) => ({name,category,source,propsType,purpose,story,lifecycle,propsExport}));

const defaults = {
  AppHeader:{variant:"'default'",titleAlign:"'center'",safeTop:'true',backIcon:'ArrowLeft',backLabel:"'Go back'",actions:'[]',sticky:'false',showShadow:'false',showBottomBorder:"variant === 'solid'"},
  Avatar:{size:"'MD'",type:"'Fallback'",shape:"'Circle'",name:"''",status:"'none'"},
  Button:{kind:"'Primary'",state:"'Default'",size:"'MD'",label:"'Button'",showLeftIcon:'false',showRightIcon:'false',fullWidth:'false'},
  Checkbox:{checked:'false',indeterminate:'false',invalid:'false',state:"'Default'",label:"'Label'"},
  Chip:{type:"'Assist'",tone:"'Neutral'",state:"'Default'",label:"'Chip'",showLeadingIcon:'true',showTrailingIcon:'true'},
  IconButton:{type:"'Primary'",size:"'LG'",state:"'Default'"},
  IconTile:{backgroundAlpha:'0.12',tileSize:'40',cornerRadius:'radius.lg'},
  IconPlaceholder:{size:"'md'",color:'colors.contentSecondary'},
  ListItem:{size:"'Standard'",artwork:"'None'",layout:"'Simple'",label:"'Label'",trailingLabel:"'Label'",trailingParagraph:"'Paragraph'",supportText:"'Support text'",thirdLine:'false',divider:'false',iconBacking:'false'},
  ListingCard:{width:'163.5'}, Radio:{checked:'false',invalid:'false',state:"'Default'",label:"'Label'"},
  ReviewCard:{width:'240'}, Switch:{value:"'off'",state:"'Default'"},
  SurfaceCard:{accent:'false',elevated:'false',borderWidth:'0.5'},
  Tag:{kind:"'Neutral'",variant:"'Solid'",state:"'Default'",label:"'NEW'",showAction:'false'},
  Tile:{artworkType:"'none'",iconColor:'colors.contentSecondary',imageBg:'false',size:"'MD'",selected:'false',disabled:'false',contentAlign:"'center'"},
  TileGrid:{columns:'4',gap:'spacing.sm'}, UpdateCard:{elevated:'false'},
  TextField:{required:'false',state:"'default'",multiline:'false',keyboardType:"'default'",formatDisplayValue:'identity',parseInputValue:'identity'},
  SearchField:{mode:"'input'",value:"''",placeholder:"'Search'",accessibilityLabel:'placeholder'},
  ChipGroup:{selectionMode:"'single'",layout:"'wrap'"}, TileGroup:{selectionMode:"'single'",columns:'2'},
  ActionFooter:{safeArea:'true'}, Banner:{tone:"'neutral'",elevated:'false'},
  ProgressSteps:{accessibilityLabel:"'Progress'"}, ModalSheet:{presentation:"'page'"},
};

const propNotes = {
  'AppHeader.actions':'Up to two trailing icon actions are rendered when rightSlot is absent.',
  'AppHeader.leftSlot':'Custom leading content; replaces the back control.',
  'AppHeader.rightSlot':'Custom trailing content; replaces actions.',
  'AppHeader.sticky':'Applies the same raised treatment as showShadow; positioning remains parent-owned.',
  'Button.state':'Explicit visual/interaction state. Disabled prevents presses.',
  'Checkbox.indeterminate':'Displays the mixed-selection mark and counts as active.',
  'Chip.selected':'Controlled selected override; takes precedence over state.',
  'Chip.disabled':'Controlled disabled override; takes precedence over state.',
  'ListItem.controlElement':'Trailing control slot. Pass null to suppress the default caret.',
  'ListItem.thirdLine':'Shows supportText on a third line for Standard size only.',
  'Tag.showAction':'Shows the compact action placeholder after the label.',
  'Tile.topTag':'Optional Tag overlay above the artwork box.',
  'Tile.trailingContent':'Arbitrary content placed after the label block.',
  'TextField.formatDisplayValue':'Transforms the controlled value for display.',
  'TextField.parseInputValue':'Transforms input text before onChangeText receives it.',
  'SearchField.mode':'Input renders a TextInput; trigger renders a button-like search launcher.',
  'ChipGroup.value':'Controlled key, key array, or null selection.',
  'TileGroup.value':'Controlled key, key array, or null selection.',
  'ListGroup.children':'Expected to be ListItem elements; dividers are injected between them.',
  'ActionFooter.primary':'Required primary FooterAction configuration.',
  'ActionFooter.secondary':'Optional secondary FooterAction; changes the footer to a two-column layout.',
  'Banner.onPress':'Makes the whole banner content pressable.',
  'Banner.onActionPress':'Callback for the optional action button.',
  'ProgressSteps.currentIndex':'Zero-based current step index.',
  'ProgressSteps.total':'Total number of step segments.',
  'ModalSheet.presentation':'Controls native/anchored modal presentation.',
  'UpdateCard.subtitle':'Mapped to Banner.description.',
};

const genericNotes = {
  title:'Primary title text.', subtitle:'Secondary supporting text.', label:'Visible label text.', description:'Supporting descriptive text.',
  onPress:'Press callback.', disabled:'Disables interaction.', state:'Supported component state.', size:'Supported size option.',
  icon:'Icon component rendered in the designated icon slot.', iconColor:'Optional icon color override.', value:'Controlled value.',
  onChange:'Controlled value-change callback.', onChangeText:'Controlled text-change callback.', children:'Child content.',
  accessibilityLabel:'Accessible name override.', style:'Parent-placement style override.', source:'Image source.', imageSource:'Image source.',
  required:'Shows the required marker.', placeholder:'Placeholder or trigger prompt.', items:'Collection items.', options:'Selectable option definitions.',
  tone:'Semantic tone.', variant:'Supported presentation variant.', kind:'Semantic action or status kind.', activeKey:'Key of the active item.',
  onPressItem:'Destination selection callback.', visible:'Controls modal visibility.', onDismiss:'Dismiss callback.',
};

function descriptionFor(component, prop) {
  return propNotes[`${component}.${prop}`] ?? genericNotes[prop] ?? `Configures ${prop.replace(/([A-Z])/g, ' $1').toLowerCase()}.`;
}

function findTypeBody(source, typeName) {
  const re = new RegExp(`(?:export\\s+)?type\\s+${typeName}\\s*=\\s*\\{`);
  const match = re.exec(source);
  if (!match) return null;
  const open = source.indexOf('{', match.index);
  let depth = 0;
  let quote = null;
  for (let i = open; i < source.length; i++) {
    const ch = source[i];
    const prev = source[i - 1];
    if (quote) {
      if (ch === quote && prev !== '\\') quote = null;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') { quote = ch; continue; }
    if (ch === '{') depth++;
    if (ch === '}' && --depth === 0) return source.slice(open + 1, i);
  }
  return null;
}

function splitMembers(body) {
  const out = [];
  let current = '';
  let curly = 0, angle = 0, paren = 0, bracket = 0;
  let quote = null;
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    const prev = body[i - 1];
    current += ch;
    if (quote) {
      if (ch === quote && prev !== '\\') quote = null;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') { quote = ch; continue; }
    if (ch === '{') curly++;
    else if (ch === '}') curly--;
    else if (ch === '<') angle++;
    else if (ch === '>') angle = Math.max(0, angle - 1);
    else if (ch === '(') paren++;
    else if (ch === ')') paren--;
    else if (ch === '[') bracket++;
    else if (ch === ']') bracket--;
    else if (ch === ';' && curly === 0 && angle === 0 && paren === 0 && bracket === 0) {
      out.push(current.slice(0, -1));
      current = '';
    }
  }
  if (current.trim()) out.push(current);
  return out;
}

function extractProps(component, source) {
  if (component.name === 'PressableSurface') return [{prop:'(inherited)',type:'PressableProps',required:'See native contract',defaultValue:'—',description:'Pass-through React Native Pressable props.'}];
  if (component.name === 'ModalSurface') return [{prop:'(inherited)',type:'ModalProps',required:'See native contract',defaultValue:'—',description:'Pass-through React Native Modal props.'}];
  const body = findTypeBody(source, component.propsType);
  if (!body) return [];
  return splitMembers(body).map((raw) => {
    const doc = raw.match(/\/\*\*([\s\S]*?)\*\//)?.[1]?.replace(/\s*\*\s?/g, ' ').trim();
    const clean = raw.replace(/\/\*\*[\s\S]*?\*\//g, '').trim();
    const match = clean.match(/^([A-Za-z_$][\w$]*)(\?)?\s*:\s*([\s\S]+)$/);
    if (!match) return null;
    const [, prop, optional, type] = match;
    return {prop,type:type.replace(/\s+/g, ' ').trim(),required:optional ? 'No' : 'Yes',defaultValue:defaults[component.name]?.[prop] ?? '—',description:doc || descriptionFor(component.name, prop)};
  }).filter(Boolean);
}

const anatomy = {
  AppHeader:[['Root container','Always','safeTop, variant, sticky, showShadow','Safe-area-aware header surface.'],['Leading region','Always','leftSlot, onBack, backIcon, backLabel','Custom content or back action.'],['Title block',"variant ≠ 'appHome' and title/subtitle present",'title, subtitle, titleAlign','One- or two-line heading.'],['Home leading region',"variant = 'appHome'",'leftSlot','Flexible home-header content.'],['Trailing region','Always','rightSlot, actions','Custom slot or up to two icon actions.'],['Action badge','badgeCount > 0','actions[].badgeCount','Count badge capped at 99+.']],
  AppBottomNav:[['Navigation bar','Always','items','Safe-area-aware destination row.'],['Destination item','For each item','items[].key, onPressItem','Pressable destination.'],['Icon','For each item','items[].icon, activeKey','Active/inactive icon state.'],['Badge','badgeLabel present','items[].badgeLabel','Short item badge.'],['Label','For each item','items[].label','Destination name.']],
  Avatar:[['Avatar body','Always','size, shape, type','Identity container.'],['Image','type = Image and source present','source','Photo content.'],['Initials','type = Initials and name present','name','Derived one- or two-letter identity.'],['Fallback icon','Otherwise','type','Generic person glyph.'],['Status dot',"status ≠ 'none'",'status','Presence indicator.']],
  Button:[['Pressable root','Always','onPress, state, fullWidth','Button interaction target.'],['Leading icon','showLeftIcon and leftIcon','showLeftIcon, leftIcon','Optional leading glyph.'],['Label','Always','label','Action name.'],['Trailing icon','showRightIcon and rightIcon','showRightIcon, rightIcon','Optional trailing glyph.']],
  CategoryStatTile:[['Pressable root','Always','onPress','Optional interaction wrapper.'],['Card surface','Always','','Contained tile surface.'],['Icon','Always','icon','Category symbol.'],['Label','Always','label','Category name.'],['Statistic','Always','stat','Compact supporting metric.']],
  Checkbox:[['Pressable row','Always','onPress, state','Checkbox interaction target.'],['Selection box','Always','checked, indeterminate, invalid','Empty, check, or mixed indicator.'],['Label','Always','label','Control name.'],['Description','description present','description','Supporting copy.']],
  Chip:[['Pressable pill','Always','type, tone, state, selected, disabled','Compact action/selection target.'],['Leading icon','enabled by flag and icon present','showLeadingIcon, leadingIcon','Optional leading glyph.'],['Label','Always','label','Chip name.'],['Trailing icon','enabled by flag and icon present','showTrailingIcon, trailingIcon','Optional trailing glyph.']],
  IconButton:[['Pressable circle','Always','type, size, state, onPress','Icon-only action target.'],['Icon','icon present','icon','Action glyph.'],['Placeholder','icon absent','','Development fallback mark.']],
  IconTile:[['Tile container','Always','backgroundColor, backgroundAlpha, tileSize, cornerRadius','Decorative icon backdrop.'],['Icon','Always','icon, iconColor, iconSize','Displayed glyph.']],
  IconPlaceholder:[['Invisible semantic wrapper','Always','size, style','Non-semantic placeholder bounds.'],['Dot','Always','color','Visible fallback marker.']],
  ListItem:[['Row root','Always','onPress, accessibilityLabel','Static or pressable list row.'],['Leading artwork','artwork = Small','leadingArtwork, iconBacking','Optional artwork slot.'],['Primary text row','Always','label, trailingLabel, layout','Label with optional trailing label.'],['Paragraph row','Standard and paragraph present','paragraph, trailingParagraph','Secondary text row.'],['Support line','Standard and thirdLine','thirdLine, supportText','Third line.'],['Control slot','Always','controlElement','Custom trailing control or default caret.'],['Divider','divider = true','divider','Indented separator.']],
  ListingCard:[['Card root','Always','width, style','Listing summary container.'],['Image','Always','imageSource','Primary listing image.'],['Title block','Always','title, distance, location','Title and location metadata.'],['Price row','Always','price, discountLabel','Current price and optional discount.'],['Original price','Always','originalPrice','Struck-through comparison price.']],
  NumberBadge:[['Badge container','Always','count','Notification badge.'],['Count text','Always','count','Displays count, capped at 99+.']],
  Radio:[['Pressable row','Always','onPress, state','Radio interaction target.'],['Radio circle','Always','checked, invalid','Selection ring and optional inner dot.'],['Label','Always','label','Control name.'],['Description','description present','description','Supporting copy.']],
  ScreenFrame:[['Safe-area frame','Always','','Prototype screen shell.'],['Scrollable content','Always','children','Descriptive content and product screen.'],['Intro card','Always','eyebrow, title, description','Prototype metadata.'],['Screen switcher','Always','activeScreen, onNavigate','Development-only navigation.']],
  SectionHeader:[['Header root','Always','','Section heading container.'],['Title row','Always','title, leadingIcon, onPress','Optional icon, title, and navigation caret.'],['Right action','rightSlot or actionLabel','rightSlot, actionLabel, actionIcon, onActionPress','Custom slot or text action.'],['Subtitle','subtitle present','subtitle','Supporting section text.']],
  Switch:[['Pressable row','Always','onPress, state','Switch interaction target.'],['Track','Always','value','On/off track.'],['Knob','Always','value','Moves between off and on positions.'],['Label block','label present','label, description','Optional label and supporting text.']],
  SurfaceCard:[['Card surface','Always','accent, elevated, borderWidth, style','Contained grouping surface.'],['Content slot','Always','children','Arbitrary child content.']],
  Tag:[['Pressable tag','Always','kind, variant, state, onPress','Static or interactive semantic label.'],['Text-variant icon','variant = Text','variant','Trend glyph.'],['Label','Always','label','Tag text.'],['Action marker','showAction = true','showAction','Compact trailing placeholder.']],
  ReviewCard:[['Card root','Always','width','Review summary surface.'],['Rating row','Always','rating','Star and one-decimal rating.'],['Badge slot','badges present','badges','Optional compact badges.'],['Review text','Always','reviewText','Review copy limited to three lines.'],['Date','Always','date','Review date label.']],
  Tile:[['Pressable root','Always','onPress, selected, disabled, contentAlign','Actionable/selectable tile.'],['Artwork box','Always','artworkType, size','Icon, image, or empty artwork area.'],['Number badge','badgeCount > 0','badgeCount','Count overlay.'],['Top tag','topTag present','topTag','Tag overlay.'],['Label block','Always','label, sublabel','Primary label and optional secondary line.'],['Trailing slot','trailingContent present','trailingContent','Content after the labels.']],
  TileGrid:[['Grid root','Always','items, columns, gap','Rows of evenly distributed tiles.'],['Tile row','For each chunk of items','columns','Horizontal row.'],['Tile','For each item','items','Delegated Tile.'],['Phantom spacer','Incomplete last row','','Preserves column alignment.']],
  UpdateCard:[['Banner','Always','all props','Legacy props mapped directly into Banner.']],
  TextField:[['Field root','Always','','Label, input container, and supporting text.'],['Label row','label present','label, required','Label and optional required marker.'],['Input container','Always','state, multiline, minHeight','Input boundary and adornment host.'],['Leading area','content/prefix present','leadingContent, prefix','Leading custom content or text prefix.'],['Text input','Always','value, onChangeText, keyboardType, inputRef','Controlled editable value.'],['Trailing area','suffix/content present','suffix, trailingContent','Trailing suffix or custom content.'],['Supporting text','helper/error present','helperText, errorMessage','Helper or error message.']],
  SearchField:[['Field root','Always','mode, onPress','Static container or trigger button.'],['Search icon','Always','','Leading search glyph.'],['Input','mode = input','value, onChangeText, inputRef','Controlled search text entry.'],['Trigger label','mode = trigger','placeholder','Search-launch prompt.'],['Clear action','input mode, value nonempty, onClear present','onClear','Clears the search query.']],
  ChipGroup:[['Group container','Always','layout','Wrapping row or horizontal scroller.'],['Chip','For each option','options','Delegated controlled Chip.']],
  TileGroup:[['Wrapping group','Always','columns','Controlled tile collection.'],['Column wrapper','For each item','columns','Percentage-width tile slot.'],['Tile','For each item','items, value, onChange','Delegated selected Tile.']],
  ListGroup:[['Card surface','Always','','Borderless group surface.'],['Clipped list','Always','children','ListItem container.'],['List item','For each child','children','Divider is injected except on the final item.']],
  ActionFooter:[['Footer root','Always','safeArea, secondary','Safe-area-aware action region.'],['Secondary action','secondary present','secondary','Tertiary by default.'],['Primary action','Always','primary','Primary by default.']],
  Banner:[['Card surface','Always','elevated','Message container.'],['Pressable/content row','Always','onPress','Whole-row action when onPress exists.'],['Icon tile','icon present','icon, iconColor, tone','Optional semantic icon.'],['Text block','Always','title, description','Title and optional description.'],['Action button','actionLabel present','actionLabel, onActionPress','Optional compact action.']],
  ProgressSteps:[['Progress root','Always','accessibilityLabel, total, currentIndex','Accessible progressbar.'],['Segment row','Always','total, currentIndex','Completed/current/upcoming segments.'],['Current label','matching label exists','labels, currentIndex','Current step name.']],
  ModalSheet:[['Native modal','Always','visible, presentation, onDismiss','Modal lifecycle and platform presentation.'],['Backdrop dismiss target','top or bottom presentation','onDismiss','Dismissible anchored backdrop.'],['Sheet surface','Always','presentation','Content surface.'],['Header','title present','title, onDismiss','Title and dismiss/back action.'],['Content slot','Always','children','Modal contents.']],
  PressableSurface:[['Native Pressable','Always','PressableProps','Direct pass-through interaction surface.']],
  ModalSurface:[['Native Modal','Always','ModalProps','Direct pass-through modal surface.']],
};

const variants = [
  ['AppHeader','variant','default, subtle, solid, transparent, appHome','default','appHome replaces the centered title layout with a flexible leading slot.'],['AppHeader','titleAlign','left, center','center','Aligns the standard title block.'],
  ['Avatar','size','XS, SM, MD, LG, XL, XXL','MD','Scales body, text/icon, and status dot.'],['Avatar','type','Image, Initials, Fallback','Fallback','Chooses identity content.'],['Avatar','shape','Circle, Rounded','Circle','Changes body shape.'],['Avatar','status','Online, Offline, Busy, none','none','Controls the status dot.'],
  ['Button','kind','Primary, Secondary, Tertiary, Inline, Link, Positive','Primary','Semantic action hierarchy.'],['Button','state','Default, Pressed, Disabled','Default','Explicit design state; native pressed state is also supported.'],['Button','size','SM, MD, LG','MD','Changes padding, icon, and label scale.'],
  ['Checkbox','state','Default, Pressed, Focused, Disabled','Default','Explicit selection-control state.'],['Checkbox','selection','unchecked, checked, indeterminate','unchecked','Controlled by checked and indeterminate.'],['Checkbox','validation','valid, invalid','valid','Controlled by invalid.'],
  ['Chip','type','Assist, Filter, Input','Assist','Defines chip role.'],['Chip','tone','Neutral, Info, Positive, Warning, Negative','Neutral','Defines semantic tone.'],['Chip','state','Default, Selected, Pressed, Disabled','Default','May be overridden by selected and disabled props.'],
  ['IconButton','type','Primary, Secondary, Tertiary, Positive','Primary','Semantic action hierarchy.'],['IconButton','size','LG, MD','LG','Changes padding and icon scale.'],['IconButton','state','Default, Disabled','Default','Disabled prevents presses.'],
  ['IconPlaceholder','size','sm, md','md','Selects placeholder bounds and dot size.'],
  ['ListItem','size','Standard, Compact','Standard','Controls row density and supporting lines.'],['ListItem','artwork','None, Small','None','Controls the leading artwork slot.'],['ListItem','layout','Simple, Label trailing','Simple','Adds trailing label/paragraph columns.'],
  ['Radio','state','Default, Pressed, Focused, Disabled','Default','Shared SelectionState contract.'],['Radio','selection','unchecked, checked','unchecked','Controlled by checked.'],['Radio','validation','valid, invalid','valid','Controlled by invalid.'],
  ['SectionHeader','title interaction','static, pressable','static','onPress adds a caret and makes the title row pressable.'],['Switch','value','off, on','off','Controlled switch value.'],['Switch','state','Default, Pressed, Focused, Disabled','Default','Shared SelectionState contract.'],
  ['SurfaceCard','accent','false, true','false','Uses the accent surface treatment.'],['SurfaceCard','elevated','false, true','false','Adds a raised surface treatment.'],
  ['Tag','kind','Neutral, Primary, Positive, Warning, Negative, Info','Neutral','Semantic status family.'],['Tag','variant','Solid, Light, Outlined, Text','Solid','Tag presentation.'],['Tag','state','Default, Disabled','Default','Disabled prevents presses.'],
  ['Tile','artworkType','icon, image, none','none','Artwork content mode.'],['Tile','size','SM, MD','MD','Artwork box size.'],['Tile','contentAlign','center, left','center','Aligns tile contents.'],['Tile','selection','unselected, selected, disabled','unselected','Controlled by selected and disabled.'],['Tile','image mode','contained, background','contained','Controlled by imageBg.'],
  ['TileGrid','columns','Any positive number','4','Number of tiles per row.'],
  ['TextField','state','default, error, disabled, readOnly','default','Controls editing and validation state.'],['TextField','input mode','single-line, multiline','single-line','Controlled by multiline.'],
  ['SearchField','mode','input, trigger','input','Editable search or search-launch action.'],
  ['ChipGroup','selectionMode','single, multiple','single','Controls value cardinality.'],['ChipGroup','layout','wrap, horizontal','wrap','Wrapping row or horizontal scroller.'],
  ['TileGroup','selectionMode','single, multiple','single','Controls value cardinality.'],['TileGroup','columns','Any positive number','2','Number of tile columns.'],
  ['ActionFooter','action count','primary only, primary + secondary','primary only','Secondary changes the footer into a two-action row.'],['ActionFooter','safe area','true, false','true','Adds bottom safe-area inset.'],
  ['Banner','tone','neutral, info, positive, warning, negative','neutral','Controls the default icon tone.'],['Banner','interaction','static, whole-banner press, action button','static','Whole-banner and action-button callbacks are independent.'],['Banner','elevated','false, true','false','Delegates raised treatment to SurfaceCard.'],
  ['ProgressSteps','segment state','completed, current, upcoming','Derived','Derived from currentIndex.'],
  ['ModalSheet','presentation','page, full, top, bottom','page','Page/full use native sheets/screens; top/bottom use anchored surfaces.'],
  ['CategoryStatTile','interaction','static, pressable','static','onPress enables interaction.'],['ListingCard','discount','hidden, visible','hidden','discountLabel shows the discount badge.'],['ReviewCard','badges','none, custom slot','none','badges renders custom compact content.'],
  ['UpdateCard','lifecycle','deprecated compatibility alias','—','Use Banner for new work.'],['PressableSurface','contract','React Native PressableProps','Inherited','Use only when public higher-level actions cannot express the pattern.'],['ModalSurface','contract','React Native ModalProps','Inherited','Prefer ModalSheet for standard overlays.'],
];

const nestedRows = [
  ['AppHeader','AppHeaderAction','key','string','Yes','Stable action identifier.','src/components/AppHeader.tsx'],
  ['AppHeader','AppHeaderAction','icon','HeaderIconComponent','Yes','Action icon component.','src/components/AppHeader.tsx'],
  ['AppHeader','AppHeaderAction','onPress','() => void','No','Action callback; absence disables the control.','src/components/AppHeader.tsx'],
  ['AppHeader','AppHeaderAction','accessibilityLabel','string','Yes','Accessible action name.','src/components/AppHeader.tsx'],
  ['AppHeader','AppHeaderAction','disabled','boolean','No','Disables the action.','src/components/AppHeader.tsx'],
  ['AppHeader','AppHeaderAction','badgeCount','number','No','Optional action count, displayed up to 99+.','src/components/AppHeader.tsx'],
  ['AppBottomNav','AppBottomNavItem','key','string','Yes','Destination identifier.','src/components/AppBottomNav.tsx'],
  ['AppBottomNav','AppBottomNavItem','label','string','Yes','Destination label.','src/components/AppBottomNav.tsx'],
  ['AppBottomNav','AppBottomNavItem','icon','NavIconComponent','Yes','Destination icon component.','src/components/AppBottomNav.tsx'],
  ['AppBottomNav','AppBottomNavItem','badgeLabel','string','No','Optional short badge label.','src/components/AppBottomNav.tsx'],
  ['ChipGroup','ChipGroupOption','key','string','Yes','Selection key.','src/components/forms/ChipGroup.tsx'],
  ['ChipGroup','ChipGroupOption','label','string','Yes','Chip label.','src/components/forms/ChipGroup.tsx'],
  ['ChipGroup','ChipGroupOption','icon','ComponentType<IconProps>','No','Optional leading icon.','src/components/forms/ChipGroup.tsx'],
  ['ChipGroup','ChipGroupOption','tone','ChipTone','No','Optional semantic tone.','src/components/forms/ChipGroup.tsx'],
  ['ChipGroup','ChipGroupOption','disabled','boolean','No','Disables this option.','src/components/forms/ChipGroup.tsx'],
  ['Tile','topTag','label','string','Yes','Overlay tag label.','src/components/Tile.tsx'],
  ['Tile','topTag','kind','TagKind','No','Overlay tag semantic kind.','src/components/Tile.tsx'],
  ['Tile','topTag','variant','TagVariant','No','Overlay tag presentation.','src/components/Tile.tsx'],
  ['TileGrid','TileGridItem','(inherited)','TileProps','Yes','Each item supports the complete Tile contract.','src/components/TileGrid.tsx'],
  ['TileGrid','TileGridItem','key','string','No','Optional stable render key.','src/components/TileGrid.tsx'],
  ['TileGroup','TileGroupItem','(inherited)','TileProps','Yes','Each item supports the complete Tile contract.','src/components/data-display/TileGroup.tsx'],
  ['TileGroup','TileGroupItem','key','string','Yes','Required controlled selection key.','src/components/data-display/TileGroup.tsx'],
  ['ActionFooter','FooterAction','label','string','Yes','Button label.','src/components/layout/ActionFooter.tsx'],
  ['ActionFooter','FooterAction','onPress','() => void','Yes','Action callback.','src/components/layout/ActionFooter.tsx'],
  ['ActionFooter','FooterAction','disabled','boolean','No','Disables the action.','src/components/layout/ActionFooter.tsx'],
  ['ActionFooter','FooterAction','kind','ButtonKind','No','Overrides the default Button kind.','src/components/layout/ActionFooter.tsx'],
];

const componentSources = new Map();
for (const component of components) {
  componentSources.set(component.name, await fs.readFile(path.join(repoRoot, component.source), 'utf8'));
}

const propRows = [];
for (const component of components) {
  for (const prop of extractProps(component, componentSources.get(component.name))) {
    propRows.push([component.name,component.category,prop.prop,prop.type,prop.required,prop.defaultValue,prop.description,component.source]);
  }
}

const anatomyRows = [];
for (const component of components) {
  (anatomy[component.name] ?? []).forEach((part, index) => anatomyRows.push([component.name,component.category,index + 1,...part,component.source]));
}

const anatomySummary = (name) => (anatomy[name] ?? []).map((row) => row[0]).join(' → ');
const variantSummary = (name) => variants.filter((row) => row[0] === name).map((row) => `${row[1]}: ${row[2]}`).join('; ') || 'No formal variants';

const workbook = Workbook.create();
const overview = workbook.worksheets.add('Overview');
const propsSheet = workbook.worksheets.add('Props');
const nestedSheet = workbook.worksheets.add('Nested types');
const variantsSheet = workbook.worksheets.add('Variants');
const anatomySheet = workbook.worksheets.add('Anatomy');
for (const sheet of [overview, propsSheet, nestedSheet, variantsSheet, anatomySheet]) sheet.showGridLines = false;

const navy = '#243447';
const blue = '#3466A6';
const paleBlue = '#EAF1F8';
const paleGray = '#F4F6F8';
const border = '#D7DEE7';
const textColor = '#1F2933';
const muted = '#5F6B76';
const amber = '#FFF4CE';
const red = '#FDE7E9';
const green = '#E7F4EC';

function setTitle(sheet, title, subtitle, lastCol) {
  sheet.getRange(`A2:${lastCol}2`).merge();
  sheet.getRange('A2').values = [[title]];
  sheet.getRange('A2').format.font = {name:fontFamily,size:15,bold:true,color:navy};
  sheet.getRange(`A3:${lastCol}3`).merge();
  sheet.getRange('A3').values = [[subtitle]];
  sheet.getRange('A3').format.font = {name:fontFamily,size:10,italic:true,color:muted};
  sheet.getRange(`A4:${lastCol}4`).format.borders = {bottom:{style:'thin',color:blue}};
}

function styleTable(sheet, rangeAddress, headerAddress) {
  const whole = sheet.getRange(rangeAddress);
  whole.format.font = {name:fontFamily,size:10,color:textColor};
  whole.format.verticalAlignment = 'top';
  const header = sheet.getRange(headerAddress);
  header.format.fill = navy;
  header.format.font = {name:fontFamily,size:10,bold:true,color:'#FFFFFF'};
  header.format.horizontalAlignment = 'center';
  header.format.verticalAlignment = 'center';
  header.format.wrapText = true;
  header.format.rowHeight = 30;
  whole.format.borders = {insideHorizontal:{style:'thin',color:border},bottom:{style:'thin',color:border}};
}

setTitle(overview,'Component specification','Public API inventory from src/components/index.ts. Scope: props, variants, anatomy, behavior, and Storybook coverage. Visual style specifications are intentionally excluded.','J');
overview.getRange('A6:B6').values = [['Components','=COUNTA(A10:A43)']];
overview.getRange('C6:D6').values = [['Storybook examples','=COUNTIFS(G10:G43,"Actions")+COUNTIFS(G10:G43,"FormInputs")+COUNTIFS(G10:G43,"Chips")+COUNTIFS(G10:G43,"Navigation")+COUNTIFS(G10:G43,"DataDisplay")+COUNTIFS(G10:G43,"Tiles")+COUNTIFS(G10:G43,"LayoutAndFeedback")+COUNTIFS(G10:G43,"OverlaysAndFooter")+COUNTIFS(G10:G43,"SearchTrigger")+COUNTIFS(G10:G43,"ProductPatterns")']];
overview.getRange('E6:F6').values = [['Internal / deprecated','=COUNTIFS(F10:F43,"Internal")+COUNTIFS(F10:F43,"Deprecated")']];
overview.getRange('G6:H6').values = [['Prop rows','=COUNTA(Props!A6:A400)']];
for (const addr of ['A6:B6','C6:D6','E6:F6','G6:H6']) {
  const r = overview.getRange(addr);
  r.format.fill = paleBlue;
  r.format.borders = {preset:'outside',style:'thin',color:border};
  r.format.font = {name:fontFamily,size:10,bold:true,color:navy};
  r.format.verticalAlignment = 'center';
  r.format.rowHeight = 28;
}
overview.getRange('A8:J8').values = [['Sources','src/components/index.ts and src/components/ComponentCatalog.stories.tsx','','Generated','2026-09-17','','Scope note','Components are included only when exported from the public barrel.','','']];
overview.getRange('A8:J8').format.font = {name:fontFamily,size:9,italic:true,color:muted};
overview.getRange('A8:J8').format.wrapText = false;
const overviewHeaders = ['Component','Category','Purpose','Anatomy summary','Variant summary','Lifecycle','Storybook story','Public prop type','Source','Notes'];
const overviewRows = components.map((c) => [c.name,c.category,c.purpose,anatomySummary(c.name),variantSummary(c.name),c.lifecycle,c.story || '',c.propsExport,c.source,c.lifecycle === 'Internal' ? 'Do not import into product screens.' : c.lifecycle === 'Deprecated' ? 'Use Banner for new work.' : c.lifecycle === 'Primitive' ? 'Use only for approved specialized patterns.' : '']);
overview.getRange(`A9:J${9 + overviewRows.length}`).values = [overviewHeaders,...overviewRows];
styleTable(overview,`A9:J${9 + overviewRows.length}`,'A9:J9');
overview.tables.add(`A9:J${9 + overviewRows.length}`,true,'ComponentOverviewTable');
overview.freezePanes.freezeRows(9);
overview.freezePanes.freezeColumns(1);
const overviewWidths = [18,14,38,46,54,13,20,15,37,34];
overviewWidths.forEach((w,i)=>overview.getRangeByIndexes(0,i,9+overviewRows.length,1).format.columnWidth=w);
overview.getRange(`C10:E${9 + overviewRows.length}`).format.wrapText = true;
overview.getRange(`I10:J${9 + overviewRows.length}`).format.wrapText = true;
overview.getRange(`A10:J${9 + overviewRows.length}`).format.rowHeight = 48;
overview.getRange(`F10:F${9 + overviewRows.length}`).conditionalFormats.add('containsText',{text:'Deprecated',format:{fill:red,font:{bold:true,color:'#9C2C36'}}});
overview.getRange(`F10:F${9 + overviewRows.length}`).conditionalFormats.add('containsText',{text:'Internal',format:{fill:amber,font:{bold:true,color:'#7A5A00'}}});
overview.getRange(`F10:F${9 + overviewRows.length}`).conditionalFormats.add('containsText',{text:'Active',format:{fill:green,font:{color:'#25643A'}}});

setTitle(propsSheet,'Component props','One row per public component prop. Required/default values reflect the current implementation contract.','H');
propsSheet.getRange('A5:H5').values = [['Component','Category','Prop','Type','Required','Default','Purpose / behavior','Source']];
propsSheet.getRange(`A6:H${5 + propRows.length}`).values = propRows;
styleTable(propsSheet,`A5:H${5 + propRows.length}`,'A5:H5');
propsSheet.tables.add(`A5:H${5 + propRows.length}`,true,'ComponentPropsTable');
propsSheet.freezePanes.freezeRows(5);
propsSheet.freezePanes.freezeColumns(3);
[18,14,24,48,11,22,52,38].forEach((w,i)=>propsSheet.getRangeByIndexes(0,i,5+propRows.length,1).format.columnWidth=w);
propsSheet.getRange(`D6:H${5 + propRows.length}`).format.wrapText = true;
propsSheet.getRange(`A6:H${5 + propRows.length}`).format.rowHeight = 36;
propsSheet.getRange(`E6:E${5 + propRows.length}`).format.horizontalAlignment = 'center';

setTitle(nestedSheet,'Nested prop types','Fields for component-owned item, action, and configuration objects referenced by the main prop contracts.','G');
nestedSheet.getRange('A5:G5').values = [['Component','Type / object','Field','Type','Required','Purpose / behavior','Source']];
nestedSheet.getRange(`A6:G${5 + nestedRows.length}`).values = nestedRows;
styleTable(nestedSheet,`A5:G${5 + nestedRows.length}`,'A5:G5');
nestedSheet.tables.add(`A5:G${5 + nestedRows.length}`,true,'NestedPropTypesTable');
nestedSheet.freezePanes.freezeRows(5);
nestedSheet.freezePanes.freezeColumns(2);
[18,22,22,40,11,54,38].forEach((w,i)=>nestedSheet.getRangeByIndexes(0,i,5+nestedRows.length,1).format.columnWidth=w);
nestedSheet.getRange(`C6:G${5 + nestedRows.length}`).format.wrapText = true;
nestedSheet.getRange(`A6:G${5 + nestedRows.length}`).format.rowHeight = 34;
nestedSheet.getRange(`E6:E${5 + nestedRows.length}`).format.horizontalAlignment = 'center';

setTitle(variantsSheet,'Component variants','Formal union variants and structural behavior modes. Boolean and free-form configuration remains fully listed on the Props tab.','F');
variantsSheet.getRange('A5:F5').values = [['Component','Variant dimension','Options','Default','Behavior notes','Source']];
const variantRows = variants.map((row) => [...row,components.find((c)=>c.name===row[0])?.source ?? '']);
variantsSheet.getRange(`A6:F${5 + variantRows.length}`).values = variantRows;
styleTable(variantsSheet,`A5:F${5 + variantRows.length}`,'A5:F5');
variantsSheet.tables.add(`A5:F${5 + variantRows.length}`,true,'ComponentVariantsTable');
variantsSheet.freezePanes.freezeRows(5);
variantsSheet.freezePanes.freezeColumns(1);
[18,22,52,18,58,38].forEach((w,i)=>variantsSheet.getRangeByIndexes(0,i,5+variantRows.length,1).format.columnWidth=w);
variantsSheet.getRange(`B6:F${5 + variantRows.length}`).format.wrapText = true;
variantsSheet.getRange(`A6:F${5 + variantRows.length}`).format.rowHeight = 34;

setTitle(anatomySheet,'Component anatomy','Structural parts, rendering conditions, driving props, and semantic roles. No visual style measurements are included.','H');
anatomySheet.getRange('A5:H5').values = [['Component','Category','Order','Part','Condition','Driven by props','Role','Source']];
anatomySheet.getRange(`A6:H${5 + anatomyRows.length}`).values = anatomyRows;
styleTable(anatomySheet,`A5:H${5 + anatomyRows.length}`,'A5:H5');
anatomySheet.tables.add(`A5:H${5 + anatomyRows.length}`,true,'ComponentAnatomyTable');
anatomySheet.freezePanes.freezeRows(5);
anatomySheet.freezePanes.freezeColumns(3);
[18,14,8,24,34,34,46,38].forEach((w,i)=>anatomySheet.getRangeByIndexes(0,i,5+anatomyRows.length,1).format.columnWidth=w);
anatomySheet.getRange(`D6:H${5 + anatomyRows.length}`).format.wrapText = true;
anatomySheet.getRange(`A6:H${5 + anatomyRows.length}`).format.rowHeight = 34;
anatomySheet.getRange(`C6:C${5 + anatomyRows.length}`).format.horizontalAlignment = 'center';

overview.tabColor = navy;
propsSheet.tabColor = blue;
nestedSheet.tabColor = '#587DA9';
variantsSheet.tabColor = '#6E8DB3';
anatomySheet.tabColor = '#8AA4C2';

workbook.recalculate();

const overviewCheck = await workbook.inspect({kind:'table',range:'Overview!A1:J18',include:'values,formulas',tableMaxRows:18,tableMaxCols:10});
console.log('OVERVIEW_CHECK');
console.log(overviewCheck.ndjson);
const propsCheck = await workbook.inspect({kind:'table',range:`Props!A1:H${Math.min(20,5+propRows.length)}`,include:'values,formulas',tableMaxRows:20,tableMaxCols:8});
console.log('PROPS_CHECK');
console.log(propsCheck.ndjson);
const errors = await workbook.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!',options:{useRegex:true,maxResults:300},summary:'final formula error scan'});
console.log('ERROR_SCAN');
console.log(errors.ndjson);

for (const [sheetName, range, filename] of [
  ['Overview','A1:J20','preview-overview.png'],
  ['Props','A1:H22','preview-props.png'],
  ['Nested types','A1:G22','preview-nested.png'],
  ['Variants','A1:F22','preview-variants.png'],
  ['Anatomy','A1:H22','preview-anatomy.png'],
]) {
  const blob = await workbook.render({sheetName,range,scale:1.4,format:'png'});
  await fs.writeFile(path.join(outputDir,filename),new Uint8Array(await blob.arrayBuffer()));
}

await fs.mkdir(outputDir,{recursive:true});
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(JSON.stringify({outputPath,componentCount:components.length,propRows:propRows.length,variantRows:variantRows.length,anatomyRows:anatomyRows.length}));
