MDIRS := $(subst /Makefile,,$(wildcard */Makefile))

.PHONY: $(MDIRS) clean ; 

all: $(MDIRS) ;

$(MDIRS) :
	$(MAKE) -C $@

clean: 
	-for d in $(MDIRS); do ( $(MAKE) -C $$d clean ); done
