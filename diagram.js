//İçimi Demirağ - 191180033

var myDiagram;

// This variation on ForceDirectedLayout does not move any selected Nodes
  // but does move all other nodes (vertexes).
  class ContinuousForceDirectedLayout extends go.ForceDirectedLayout {
    isFixed(v) {
      return v.node.isSelected;
    }

    // optimization: reuse the ForceDirectedNetwork rather than re-create it each time
    doLayout(coll) {
      if (!this._isObserving) {
        this._isObserving = true;
        // cacheing the network means we need to recreate it if nodes or links have been added or removed or relinked,
        // so we need to track structural model changes to discard the saved network.
        this.diagram.addModelChangedListener(e => {
          // modelChanges include a few cases that we don't actually care about, such as
          // "nodeCategory" or "linkToPortId", but we'll go ahead and recreate the network anyway.
          // Also clear the network when replacing the model.
          if (e.modelChange !== "" ||
            (e.change === go.ChangedEvent.Transaction && e.propertyName === "StartingFirstTransaction")) {
            this.network = null;
          }
        });
      }
      var net = this.network;
      if (net === null) {  // the first time, just create the network as normal
        this.network = net = this.makeNetwork(coll);
      } else {  // but on reuse we need to update the LayoutVertex.bounds for selected nodes
        this.diagram.nodes.each(n => {
          var v = net.findVertex(n);
          if (v !== null) v.bounds = n.actualBounds;
        });
      }
      // now perform the normal layout
      super.doLayout(coll);
      // doLayout normally discards the LayoutNetwork by setting Layout.network to null;
      // here we remember it for next time
      this.network = net;
    }
  }
  // end ContinuousForceDirectedLayout


    function init() {

      // Since 2.2 you can also author concise templates with method chaining instead of GraphObject.make
      // For details, see https://gojs.net/latest/intro/buildingObjects.html
      const $ = go.GraphObject.make;  // for conciseness in defining templates

      myDiagram =
        $(go.Diagram, "myDiagramDiv",  // must name or refer to the DIV HTML element
          {
            initialAutoScale: go.Diagram.Uniform,  // an initial automatic zoom-to-fit
            contentAlignment: go.Spot.Center,  // align document to the center of the viewport
            layout:
              $(ContinuousForceDirectedLayout,  // automatically spread nodes apart while dragging
                { defaultSpringLength: 30, defaultElectricalCharge: 100 }),
            // do an extra layout at the end of a move
            "SelectionMoved": e => e.diagram.layout.invalidateLayout()
          });

      // dragging a node invalidates the Diagram.layout, causing a layout during the drag
      myDiagram.toolManager.draggingTool.doMouseMove = function() {
        go.DraggingTool.prototype.doMouseMove.call(this);
        if (this.isActive) { this.diagram.layout.invalidateLayout(); }
      }

      // define each Node's appearance
      myDiagram.nodeTemplate =
        $(go.Node, "Auto",  // the whole node panel
          // define the node's outer shape, which will surround the TextBlock
          $(go.Shape, "Circle",
            { fill: "CornflowerBlue", stroke: "black", spot1: new go.Spot(0, 0, 5, 5), spot2: new go.Spot(1, 1, -5, -5) }),
          $(go.TextBlock,
            { font: "bold 10pt helvetica, bold arial, sans-serif", textAlign: "center", maxSize: new go.Size(100, NaN) },
            new go.Binding("text", "text"))
        );
      // the rest of this app is the same as samples/conceptMap.html

      // replace the default Link template in the linkTemplateMap
      myDiagram.linkTemplate =
        $(go.Link,  // the whole link panel
          $(go.Shape,  // the link shape
          new go.Binding("stroke", "color")
            //{ stroke: "black" }
            ),
          // $(go.Shape,  // the arrowhead
          //   { toArrow: "standard", stroke: null }),
          $(go.Panel, "Auto",
            $(go.Shape,  // the label background, which becomes transparent around the edges
              {
                fill: $(go.Brush, "Radial", { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" }),
                stroke: null
              }),
            $(go.TextBlock,  // the label text
              {
                textAlign: "center",
                font: "10pt helvetica, arial, sans-serif",
                stroke: "#555555",
                margin: 4
              },
              new go.Binding("text", "text"))
          )
        );
    }

    function reload() {
      //myDiagram.layout.network = null;
      var text = myDiagram.model.toJson();
      myDiagram.model = go.Model.fromJson(text);
      //myDiagram.layout =
      //  go.GraphObject.make(ContinuousForceDirectedLayout,  // automatically spread nodes apart while dragging
      //    { defaultSpringLength: 30, defaultElectricalCharge: 100 });
    }
    window.addEventListener('DOMContentLoaded', init);