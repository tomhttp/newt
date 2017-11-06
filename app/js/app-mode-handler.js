var appUtilities = require('./app-utilities');

var modeHandler = {
  initialMode: "selection-mode",
  initialSustainMode: false,
  initialSelectedNodeType: "macromolecule",
  initialSelectedEdgeType: "consumption",
  initialSelectedLanguage: "PD",
  // Initilize mode handler
  initilize: function () {
    $('#select-mode-icon').parent().addClass('selected-mode'); // Initial mode is selection mode.
    $('.node-palette img').addClass('inactive-palette-element');
    $('.edge-palette img').addClass('inactive-palette-element');
    // Node/edge palettes should be initialized according to default selectedNodeType and selectedEdgeType
    var defaultNodeImg = $('.node-palette img[value="'+this.initialSelectedNodeType+'"]');
    var defaultEdgeImg = $('.edge-palette img[value="'+this.initialSelectedEdgeType+'"]');
    defaultNodeImg.addClass('selected-mode');
    defaultEdgeImg.addClass('selected-mode');
    // also set the icons in toolbar accordingly
    $('#add-node-mode-icon').attr('src', defaultNodeImg.attr('src'));
    $('#add-node-mode-icon').attr('title', "Create a new " + defaultNodeImg.attr('title'));
    $('#add-edge-mode-icon').attr('src', defaultEdgeImg.attr('src'));
    $('#add-edge-mode-icon').attr('title', "Create a new " + defaultEdgeImg.attr('title'));
  },

  // inilizes modeProperties field in the scratch pad of cy
  initModeProperties: function (cy) {
    // create an object for mode properties of cy
    var modeProperties = {
      mode: modeHandler.initialMode,
      sustainMode: modeHandler.initialSustainMode,
      selectedNodeType: modeHandler.initialSelectedNodeType,
      selectedEdgeType: modeHandler.initialSelectedEdgeType,
      selectedLanguage: modeHandler.initialSelectedLanguage
    };

    // register mode properties to the scratch pad of cy
    appUtilities.setScratch(cy, 'modeProperties', modeProperties);
  },

  adjustUIComponents: function (cy) {

    // access the mode properties of cy
    var modeProperties = appUtilities.getScratch(cy, 'modeProperties');

    // html values to select
    var nodeVal = modeProperties.selectedNodeType.replace(/ /gi, '-'); // Html values includes '-' instead of ' '
    var edgeVal = modeProperties.selectedEdgeType.replace(/ /gi, '-'); // Html values includes '-' instead of ' '

    var mode = modeProperties.mode;
    var sustainMode = modeProperties.sustainMode;
    var lang = modeProperties.selectedLanguage;

    // TODO complete this method
  },

  // Set the current mode to add node mode, if nodeType is specified than switch the current node type to the given value,
  // if the nodeType will remain same, add node mode is already enabled and sustain mode is not set before, then set the sustain mode
  // so that users will be able to add the current node type in a sustainable way.
  setAddNodeMode: function (cy, nodeType, language) {

    // access mode properties of the cy
    var modeProperties = appUtilities.getScratch(cy, 'modeProperties');

    var typeChange = nodeType && nodeType != modeProperties.selectedNodeType; // See if the type will change
    // Handle sustainable mode
    $('.selected-mode-sustainable').removeClass('selected-mode-sustainable');
    if (!typeChange && modeProperties.mode == "add-node-mode" && !modeProperties.sustainMode) {
      modeProperties.sustainMode = true;
      $('#add-node-mode-icon').parent().addClass('selected-mode-sustainable');
      $('.node-palette .selected-mode').addClass('selected-mode-sustainable');
    }
    else {
      modeProperties.sustainMode = false;
    }

    if (modeProperties.mode != "add-node-mode") {
      cy.elements().unselect();
      modeHandler.mode = "add-node-mode";

      $('#select-mode-icon').parent().removeClass('selected-mode');
      $('#add-edge-mode-icon').parent().removeClass('selected-mode');
      $('#add-node-mode-icon').parent().addClass('selected-mode');
      $('.node-palette img').removeClass('inactive-palette-element');
      $('.edge-palette img').addClass('inactive-palette-element');

      modeHandler.autoEnableMenuItems(false);

      cy.edgehandles('drawoff');

      cy.autoungrabify(true);
      cy.autounselectify(true);
    }
    else if(!modeProperties.sustainMode && !typeChange){
        modeHandler.setSelectionMode(cy);
    }

    // Check if there is a needed type change if there is perform it.
    if ( typeChange ) {
      modeProperties.selectedNodeType = nodeType;
    }
    if ( language ) {
      modeProperties.selectedLanguage = language;
    }

    // reset mode properties of cy
    appUtilities.setScratch(cy, 'modeProperties', modeProperties);
  },
  // Set the current mode to add edge mode, if edgeType is specified than switch the current edge type to the given value,
  // if the edgeType will remain same, add edge mode is already enabled and sustain mode is not set before, then set the sustain mode
  // so that users will be able to add the current edge type in a sustainable way.
  setAddEdgeMode: function (cy, edgeType, language) {

    // access mode properties of the cy
    var modeProperties = appUtilities.getScratch(cy, 'modeProperties');

    var typeChange = edgeType && edgeType != modeProperties.selectedEdgeType; // See if the type will change

    // Handle sustainable mode
    $('.selected-mode-sustainable').removeClass('selected-mode-sustainable');
    if (!typeChange && modeProperties.mode == "add-edge-mode" && !modeProperties.sustainMode) {
      modeProperties.sustainMode = true;
      $('#add-edge-mode-icon').parent().addClass('selected-mode-sustainable');
      $('.edge-palette .selected-mode').addClass('selected-mode-sustainable');
    }
    else {
      modeProperties.sustainMode = false;
    }

    if (modeProperties.mode != "add-edge-mode") {
      cy.elements().unselect();
      modeProperties.mode = "add-edge-mode";

      $('#select-mode-icon').parent().removeClass('selected-mode');
      $('#add-edge-mode-icon').parent().addClass('selected-mode');
      $('#add-node-mode-icon').parent().removeClass('selected-mode');
      $('.node-palette img').addClass('inactive-palette-element');
      $('.edge-palette img').removeClass('inactive-palette-element');

      modeHandler.autoEnableMenuItems(false);

      cy.autounselectify(true);

      cy.edgehandles('drawon');
    }
    else if(!modeHandler.sustainMode && !typeChange){
        modeHandler.setSelectionMode(cy);
    }

    // Check if there is a needed type change if there is perform it.
    if ( typeChange ) {
      modeProperties.selectedEdgeType = edgeType;
    }
    if (language) {
      modeProperties.selectedLanguage = language;
    }

    // reset mode properties of cy
    appUtilities.setScratch(cy, 'modeProperties', modeProperties);
  },
  // Set selection mode, disables sustainable mode.
  setSelectionMode: function (cy) {

    // access mode properties of the cy
    var modeProperties = appUtilities.getScratch(cy, 'modeProperties');

    if (modeProperties.mode != "selection-mode") {
      $('#select-mode-icon').parent().addClass('selected-mode');
      $('#add-edge-mode-icon').parent().removeClass('selected-mode');
      $('#add-node-mode-icon').parent().removeClass('selected-mode');
      $('.node-palette img').addClass('inactive-palette-element');
      $('.edge-palette img').addClass('inactive-palette-element');

      modeHandler.autoEnableMenuItems(true);

      modeProperties.mode = "selection-mode";

      cy.edgehandles('drawoff');

      cy.autoungrabify(false);
      cy.autounselectify(false);
    }

    $('.selected-mode-sustainable').removeClass('selected-mode-sustainable');
    modeProperties.sustainMode = false;

    // reset mode properties of cy
    appUtilities.setScratch(cy, 'modeProperties', modeProperties);
  },
  autoEnableMenuItems: function (enable) {
    if (enable) {
      $("#expand-selected").parent("li").removeClass("disabled");
      $("#collapse-selected").parent("li").removeClass("disabled");
      $("#expand-all").parent("li").removeClass("disabled");
      $("#collapse-all").parent("li").removeClass("disabled");
      $("#perform-layout").parent("li").removeClass("disabled");
      $("#delete-selected-simple").parent("li").removeClass("disabled");
      $("#delete-selected-smart").parent("li").removeClass("disabled");
      $("#hide-selected").parent("li").removeClass("disabled");
      $("#show-selected").parent("li").removeClass("disabled");
      $("#show-all").parent("li").removeClass("disabled");
      $("#make-compound-complex").parent("li").removeClass("disabled");
      $("#make-compound-compartment").parent("li").removeClass("disabled");
      $("#neighbors-of-selected").parent("li").removeClass("disabled");
      $("#processes-of-selected").parent("li").removeClass("disabled");
      $("#remove-highlights").parent("li").removeClass("disabled");
    }
    else{
      $("#expand-selected").parent("li").addClass("disabled");
      $("#collapse-selected").parent("li").addClass("disabled");
      $("#expand-all").parent("li").addClass("disabled");
      $("#collapse-all").parent("li").addClass("disabled");
      $("#perform-layout").parent("li").addClass("disabled");
      $("#delete-selected-simple").parent("li").addClass("disabled");
      $("#delete-selected-smart").parent("li").addClass("disabled");
      $("#hide-selected").parent("li").addClass("disabled");
      $("#show-selected").parent("li").addClass("disabled");
      $("#show-all").parent("li").addClass("disabled");
      $("#make-compound-complex").parent("li").addClass("disabled");
      $("#make-compound-compartment").parent("li").addClass("disabled");
      $("#neighbors-of-selected").parent("li").addClass("disabled");
      $("#processes-of-selected").parent("li").addClass("disabled");
      $("#remove-highlights").parent("li").addClass("disabled");
    }
  }
};

module.exports = modeHandler;
