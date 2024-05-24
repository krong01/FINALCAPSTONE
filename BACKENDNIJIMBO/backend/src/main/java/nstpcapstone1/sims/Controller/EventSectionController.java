package nstpcapstone1.sims.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.persistence.EntityNotFoundException;
import nstpcapstone1.sims.Entity.EventSectionEntity;
import nstpcapstone1.sims.Repository.EventSectionRepository;
import nstpcapstone1.sims.Repository.EventTeacherRepository;
import nstpcapstone1.sims.Service.EventSectionService;
import nstpcapstone1.sims.Service.EventTeacherService;

@RestController
@CrossOrigin(origins="*")
public class EventSectionController {
	
	private final EventSectionService eventSectionService;
	private final EventSectionRepository eventSectionRepository;

	@Autowired
	public EventSectionController(EventSectionService eventSectionService, EventSectionRepository eventSectionRepository) {
	    this.eventSectionService = eventSectionService;
	    this.eventSectionRepository = eventSectionRepository;
	}
	@PostMapping("/assignSectionToEvent")
	public String assignSectionToEvent(@RequestBody EventSectionEntity eventSectionEntity) {
	    try {
	        eventSectionService.assignSectionToEvent(eventSectionEntity);
	        return "Section assigned to event successfully";
	    } catch (Exception e) {
	        e.printStackTrace();
	        return "Failed to assign section to event";
	    }
	}   
	@GetMapping("/sectionevent/{eventId}")
	public ResponseEntity<List<EventSectionEntity>> getByEventId(@PathVariable Long eventId) {
	    List<EventSectionEntity> eventSections = eventSectionRepository.findByEventEventID(eventId);
	    if (eventSections.isEmpty()) {
	        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	    }
	    return new ResponseEntity<>(eventSections, HttpStatus.OK);
	}
//	@GetMapping("/sectionevents/{id}")
//	public ResponseEntity<List<EventSectionEntity>> getByUserId(@PathVariable Long id) {
//	    List<EventSectionEntity> eventSections = eventSectionRepository.findByid(id);
//	    if (eventSections.isEmpty()) {
//	        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//	    }
//	    return new ResponseEntity<>(eventSections, HttpStatus.OK);
//	}
	@GetMapping("/sectionevents/{sectionId}")
	public List<EventSectionEntity> getBySectionID(@PathVariable Long sectionId) {
	    return eventSectionRepository.findBySectionId(sectionId);
	}
	@DeleteMapping("/deleteByEventID/{eventId}")
    public ResponseEntity<Void> deleteByEventID(@PathVariable Long eventId) {
        eventSectionService.deleteByEventID(eventId);
        return ResponseEntity.noContent().build(); // Return 204 No Content
    }
	@DeleteMapping("/deleteeventsection/{eventId}/{sectionId}")
    public ResponseEntity<String> deleteByEventIdAndSectionId(@PathVariable Long eventId, @PathVariable Long sectionId) {
        boolean deleted = eventSectionService.deleteByEventIdAndSectionId(eventId, sectionId);
        if (deleted) {
            return ResponseEntity.ok("Entry deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Entry not found");
        }
    }
	 @PostMapping("/eventsection")
	    public ResponseEntity<EventSectionEntity> createEventSection(@RequestBody EventSectionEntity eventSectionEntity) {
	        EventSectionEntity createdEventSection = eventSectionService.createEventSection(eventSectionEntity);
	        return new ResponseEntity<>(createdEventSection, HttpStatus.CREATED);
	    }
	 @DeleteMapping("/deleteeventsection/{id}")
	    public ResponseEntity<String> deleteBySectionId(@PathVariable Long id) {
	        eventSectionService.deleteBySectionId(id);
	        return ResponseEntity.noContent().build();
	    }
}