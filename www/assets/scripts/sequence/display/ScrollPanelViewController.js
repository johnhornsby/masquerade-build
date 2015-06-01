var ScrollPanelViewController = function(options){
	
	this._frameElement = options.frameElement;
	this._contentElement = options.contentElement;
	this._scrollDirection = options.scrollDirection || ScrollPanelViewController.SCROLL_DIRECTION_VERTICAL;
	this._scrollPanelController;
	
	this._frameWidth = $(this._frameElement).width();
	this._contentWidth = $(this._contentElement).width();
	this._frameHeight = $(this._frameElement).height();
	this._contentHeight = $(this._contentElement).height();

	this._$horizontalThumb = $(options.horizontalThumb);
	this._$horizontalThumbFrame = $(options.horizontalThumbFrame);
	this._horizontalFrameWidth = this._$horizontalThumbFrame.width();
	
	this._$verticleThumb = $(options.verticleThumb);
	this._$verticleThumbFrame = $(options.verticleThumbFrame);
	this._verticleFrameHeight = this._$verticleThumbFrame.height();
	
	this._init();
};

ScrollPanelViewController.SCROLL_DIRECTION_VERTICAL = 0;
ScrollPanelViewController.SCROLL_DIRECTION_HORIZONTAL = 1;
ScrollPanelViewController.SCROLL_DIRECTION_BOTH = 2;





//PRIVATE
//_______________________________________________________________________
ScrollPanelViewController.prototype._init = function(){
	
	var options  = {
		scrollDirection:this._scrollDirection,
		frameWidth:$(this._frameElement).width(),
		contentWidth:$(this._contentElement).width(),
		frameHeight:$(this._frameElement).height(),
		contentHeight:$(this._contentElement).height(),
		frameElement:(this._frameElement),
		bounce:true,
		wrap:false
	};
	this._scrollPanelController = new ScrollPanelController(options);
	this._scrollPanelController.setDelegate(this);
	this._scrollPanelController.setScrollBarDelegate(this);
};


ScrollPanelViewController.prototype._getScrollProperties = function(containerDimension, frameDimension, containerPosition){
	var thumbDimension;
	var visiblePercentage = frameDimension / containerDimension;
	thumbDimension = frameDimension * visiblePercentage;
	
	var maxScrollDistance = containerDimension - frameDimension;
	var destinationScrollPercentage = containerPosition / maxScrollDistance;
	var frameToContentDimensionRatio = frameDimension / containerDimension;
	var scrollThumbMaxTrackLength = (1 - frameToContentDimensionRatio) * frameDimension;
	var scrollThumbDestination = (destinationScrollPercentage * scrollThumbMaxTrackLength) * -1;
	var shouldScroll = true;
		
	var distanceOutside;
	if(containerPosition > 0 ){
		distanceOutside = containerPosition;
		thumbDimension = thumbDimension - distanceOutside;
		thumbDimension = Math.max(thumbDimension,14);
		scrollThumbDestination = 0;
	}else if((containerPosition + containerDimension) < frameDimension){
		distanceOutside = frameDimension - (containerPosition + containerDimension);
		thumbDimension = thumbDimension - distanceOutside;
		thumbDimension = Math.max(thumbDimension,14);
		scrollThumbDestination = frameDimension - thumbDimension;
	}
	if(containerDimension <= frameDimension){
		shouldScroll = false;
	}
	return {position:(scrollThumbDestination / frameDimension), dimension:(thumbDimension / frameDimension), shouldScroll:shouldScroll}
};


//ScrollPanelController Delegate Methods
//_______________________________________________________________________
ScrollPanelViewController.prototype.updatePosition = function(x,y){
	$(this._contentElement).css({left:x,top:y});
	
	//update scroll bars
	var scrollProperties = undefined;
	scrollProperties = this._getScrollProperties(this._contentWidth, this._frameWidth, x);
	this._$horizontalThumb.css({
		left:  scrollProperties.position * this._horizontalFrameWidth,
		width: scrollProperties.dimension * this._horizontalFrameWidth,
		display: (scrollProperties.shouldScroll)? "block":"none"
	});
	
	scrollProperties = this._getScrollProperties(this._contentHeight, this._frameHeight, y);

	this._$verticleThumb.css({
		top:  scrollProperties.position * this._verticleFrameHeight,
		height: scrollProperties.dimension * this._verticleFrameHeight,
		display: (scrollProperties.shouldScroll)? "block":"none"
	});
};	


//PUBLIC
//_______________________________________________________________________
ScrollPanelViewController.prototype.updateFrameDimensions = function() {
	//TODO
	//adjust pagination index and number of pages
	this._frameWidth = $(this._frameElement).width();
	this._contentWidth = $(this._contentElement).width();
	var borderTop = parseInt($(this._frameElement).css("border-top"));
	if (isNaN(borderTop)) {
		borderTop = 0;
	}
	var borderBottom = parseInt($(this._frameElement).css("border-bottom"));
	if (isNaN(borderBottom)) {
		borderBottom = 0;
	}
	this._frameHeight = $(this._frameElement).height() - borderTop + borderBottom;
	this._contentHeight = $(this._contentElement).height();
	this._horizontalFrameWidth = this._$horizontalThumbFrame.width();
	this._verticleFrameHeight = this._$verticleThumbFrame.height();

	this._scrollPanelController.setContentDimensions(this._contentWidth, this._contentHeight);
	this._scrollPanelController.setFrame(this._frameWidth, this._frameHeight);
	//this._calculateNumberOfPages();
	//this._updatePageIndex();
};

ScrollPanelViewController.prototype.getContentWidth = function(){
	return this._contentWidth;
};

ScrollPanelViewController.prototype.getFrameWidth = function(){
	return this._frameWidth;
};

ScrollPanelViewController.prototype.getContentHeight = function(){
	return this._contentWidth;
};

ScrollPanelViewController.prototype.getFrameHeight = function(){
	return this._frameWidth;
};

