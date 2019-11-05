<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
  <xsl:output method="text" ></xsl:output>
  <!-- output is a css file that can be used to style country polygons by their @id 
       in a random css color -->
  
  <xsl:variable name="nl"><xsl:text>
</xsl:text>
  </xsl:variable>  
  <xsl:template match="/">
    <!-- input file is ecere_testing_css_colors.xml, which contains an ol of css named colors -->
    <xsl:text>
svg.style-scope.web-map path.fclass { stroke: blue; }

    </xsl:text>
    <xsl:apply-templates select="ol/span"><xsl:with-param name="offset" select="0"/></xsl:apply-templates>
    <xsl:apply-templates select="ol/span"><xsl:with-param name="offset" select="count(//ol/span)"/></xsl:apply-templates>
    
    <xsl:value-of select="$nl"/>
    
    <xsl:text>
      /* fclass.span is the class assigned to coordinates elements which
      _contain_ one or more span element(s), not to the parts of coordinates that
      are wrapped in spans. These should be stroked (if the fclass with the stroke 
      assigned to path.fclass, but should not be filled, since they represent only
      polygon boundaries)*/
svg.style-scope.web-map path.fclass.span { fill:none; }
      
      /* Those parts which are wrapped in a span also inherit the class
      values of the span element, which in this case are taken to be noline and
      aren't therefore drawn at all (they are there only to represent tile boundaries)*/
svg.style-scope.web-map path.span.noline { display: none}
      </xsl:text>
  </xsl:template>
  <xsl:template match="ol/span">
    <xsl:param name="offset"></xsl:param>

    <xsl:text>svg.web-map.style-scope path.fclass._</xsl:text>
    <xsl:value-of select="position() + $offset"/><xsl:text> { stroke: blue; fill: </xsl:text>
    <xsl:value-of select="span[position() eq 2]"/><xsl:text>;}</xsl:text>
    <xsl:value-of select="$nl"/>
  </xsl:template>
</xsl:stylesheet>