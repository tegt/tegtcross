LINKS = /tdtg/conf/conf.d/tegtcross.conf

MDIRS := $(subst /Makefile,,$(wildcard */Makefile))

.PHONY: $(MDIRS) clean $(LINKS) all; 

all: $(MDIRS) $(LINKS) ;

$(MDIRS) :
	$(MAKE) -C $@

clean: 
	-for d in $(MDIRS); do ( $(MAKE) -C $$d clean ); done
	-rm $(LINKS)

$(LINKS) :
	mkdir -p $(dir $@)
	ln -f -s $(shell pwd)/$(notdir $@) $@ 

